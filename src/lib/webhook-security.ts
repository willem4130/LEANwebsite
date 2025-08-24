/**
 * Webhook Security & Authentication System
 * ========================================
 * 
 * Comprehensive security layer for webhook handling with authentication,
 * authorization, rate limiting, and threat protection
 */

import { z } from 'zod'
import { createHmac, randomBytes, timingSafeEqual } from 'crypto'
import { NextRequest } from 'next/server'
import { webhookRegistry } from './webhook-integration'

// ================================
// 1. SECURITY CONFIGURATION
// ================================

export const WebhookSecurityConfigSchema = z.object({
  // Authentication
  authentication: z.object({
    required: z.boolean().default(true),
    methods: z.array(z.enum(['hmac-sha256', 'bearer-token', 'api-key', 'oauth2', 'mutual-tls'])).default(['hmac-sha256']),
    hmac: z.object({
      secretKey: z.string().min(32),
      algorithm: z.enum(['sha256', 'sha512']).default('sha256'),
      headerName: z.string().default('x-webhook-signature'),
    }).optional(),
    bearer: z.object({
      tokens: z.array(z.string()),
      headerName: z.string().default('authorization'),
    }).optional(),
    apiKey: z.object({
      keys: z.array(z.string()),
      headerName: z.string().default('x-api-key'),
    }).optional(),
  }),
  
  // Rate Limiting
  rateLimiting: z.object({
    enabled: z.boolean().default(true),
    windowMs: z.number().default(15 * 60 * 1000), // 15 minutes
    maxRequests: z.number().default(1000),
    skipSuccessfulRequests: z.boolean().default(false),
    skipFailedRequests: z.boolean().default(false),
    keyGenerator: z.enum(['ip', 'user-agent', 'api-key', 'custom']).default('ip'),
  }),
  
  // Request Validation
  validation: z.object({
    maxBodySize: z.number().default(1024 * 1024), // 1MB
    allowedContentTypes: z.array(z.string()).default(['application/json']),
    requiredHeaders: z.array(z.string()).default([]),
    ipWhitelist: z.array(z.string()).optional(),
    ipBlacklist: z.array(z.string()).optional(),
    userAgentBlacklist: z.array(z.string()).optional(),
  }),
  
  // Threat Protection
  threatProtection: z.object({
    enableDDoSProtection: z.boolean().default(true),
    suspiciousActivityThreshold: z.number().default(100), // requests per minute
    blockDuration: z.number().default(3600000), // 1 hour in milliseconds
    enableGeoBlocking: z.boolean().default(false),
    blockedCountries: z.array(z.string()).default([]),
  }),
  
  // Logging & Monitoring
  logging: z.object({
    logAllRequests: z.boolean().default(true),
    logPayloads: z.boolean().default(false), // Security sensitive
    logFailedAuth: z.boolean().default(true),
    retentionDays: z.number().default(30),
  }),
  
  // CORS Settings
  cors: z.object({
    enabled: z.boolean().default(true),
    allowedOrigins: z.array(z.string()).default(['*']),
    allowedMethods: z.array(z.string()).default(['POST', 'PUT']),
    allowedHeaders: z.array(z.string()).default(['content-type', 'authorization']),
  }),
})

export type WebhookSecurityConfig = z.infer<typeof WebhookSecurityConfigSchema>

// ================================
// 2. AUTHENTICATION HANDLERS
// ================================

export abstract class AuthenticationHandler {
  abstract authenticate(request: NextRequest, config: any): Promise<AuthResult>
  abstract getName(): string
}

export interface AuthResult {
  success: boolean
  identity?: string
  error?: string
  metadata?: Record<string, any>
}

// HMAC SHA256 Authentication
export class HMACAuthHandler extends AuthenticationHandler {
  getName(): string {
    return 'hmac-sha256'
  }

  async authenticate(request: NextRequest, config: any): Promise<AuthResult> {
    const signature = request.headers.get(config.headerName || 'x-webhook-signature')
    if (!signature) {
      return { success: false, error: 'Missing signature header' }
    }

    try {
      const body = await request.text()
      const expectedSignature = this.generateSignature(body, config.secretKey, config.algorithm || 'sha256')
      const providedSignature = signature.replace(/^sha256=|^sha512=/, '')
      
      if (!this.verifySignature(expectedSignature, providedSignature)) {
        return { success: false, error: 'Invalid signature' }
      }

      return {
        success: true,
        identity: 'hmac-verified',
        metadata: { algorithm: config.algorithm || 'sha256' }
      }
    } catch (error) {
      return { success: false, error: `Authentication error: ${error}` }
    }
  }

  private generateSignature(payload: string, secret: string, algorithm: string): string {
    return createHmac(algorithm, secret).update(payload, 'utf8').digest('hex')
  }

  private verifySignature(expected: string, provided: string): boolean {
    return timingSafeEqual(
      Buffer.from(expected, 'hex'),
      Buffer.from(provided, 'hex')
    )
  }
}

// Bearer Token Authentication
export class BearerTokenAuthHandler extends AuthenticationHandler {
  getName(): string {
    return 'bearer-token'
  }

  async authenticate(request: NextRequest, config: any): Promise<AuthResult> {
    const authHeader = request.headers.get(config.headerName || 'authorization')
    if (!authHeader) {
      return { success: false, error: 'Missing authorization header' }
    }

    const token = authHeader.replace(/^Bearer\s+/, '')
    if (!config.tokens.includes(token)) {
      return { success: false, error: 'Invalid bearer token' }
    }

    return {
      success: true,
      identity: `bearer-${token.substring(0, 8)}...`,
      metadata: { tokenPrefix: token.substring(0, 8) }
    }
  }
}

// API Key Authentication
export class APIKeyAuthHandler extends AuthenticationHandler {
  getName(): string {
    return 'api-key'
  }

  async authenticate(request: NextRequest, config: any): Promise<AuthResult> {
    const apiKey = request.headers.get(config.headerName || 'x-api-key')
    if (!apiKey) {
      return { success: false, error: 'Missing API key header' }
    }

    if (!config.keys.includes(apiKey)) {
      return { success: false, error: 'Invalid API key' }
    }

    return {
      success: true,
      identity: `api-key-${apiKey.substring(0, 8)}...`,
      metadata: { keyPrefix: apiKey.substring(0, 8) }
    }
  }
}

// OAuth2 Authentication Handler
export class OAuth2AuthHandler extends AuthenticationHandler {
  getName(): string {
    return 'oauth2'
  }

  async authenticate(request: NextRequest, config: any): Promise<AuthResult> {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return { success: false, error: 'Missing authorization header' }
    }

    const token = authHeader.replace(/^Bearer\s+/, '')
    
    try {
      // Validate token with OAuth2 provider
      const isValid = await this.validateOAuth2Token(token, config)
      if (!isValid.valid) {
        return { success: false, error: 'Invalid OAuth2 token' }
      }

      return {
        success: true,
        identity: isValid.subject || 'oauth2-user',
        metadata: { 
          provider: config.provider,
          scope: isValid.scope 
        }
      }
    } catch (error) {
      return { success: false, error: `OAuth2 validation error: ${error}` }
    }
  }

  private async validateOAuth2Token(token: string, config: any): Promise<{
    valid: boolean
    subject?: string
    scope?: string[]
  }> {
    // This would integrate with your OAuth2 provider
    // For example, validating with Google, Auth0, etc.
    const response = await fetch(config.introspectionEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${config.clientId}:${config.clientSecret}`)}`,
      },
      body: `token=${token}`,
    })

    if (!response.ok) {
      throw new Error(`Token introspection failed: ${response.statusText}`)
    }

    const result = await response.json()
    return {
      valid: result.active === true,
      subject: result.sub,
      scope: result.scope?.split(' '),
    }
  }
}

// ================================
// 3. RATE LIMITING
// ================================

export interface RateLimitStore {
  get(key: string): Promise<{ count: number; resetTime: number } | null>
  set(key: string, value: { count: number; resetTime: number }, ttl: number): Promise<void>
  increment(key: string, ttl: number): Promise<{ count: number; resetTime: number }>
}

// In-memory rate limit store (use Redis in production)
export class MemoryRateLimitStore implements RateLimitStore {
  private store = new Map<string, { count: number; resetTime: number }>()

  async get(key: string): Promise<{ count: number; resetTime: number } | null> {
    const entry = this.store.get(key)
    if (!entry || entry.resetTime < Date.now()) {
      this.store.delete(key)
      return null
    }
    return entry
  }

  async set(key: string, value: { count: number; resetTime: number }, ttl: number): Promise<void> {
    this.store.set(key, value)
    setTimeout(() => this.store.delete(key), ttl)
  }

  async increment(key: string, ttl: number): Promise<{ count: number; resetTime: number }> {
    const existing = await this.get(key)
    const resetTime = existing?.resetTime || (Date.now() + ttl)
    const count = (existing?.count || 0) + 1
    
    const entry = { count, resetTime }
    await this.set(key, entry, ttl)
    return entry
  }
}

export class RateLimiter {
  private store: RateLimitStore

  constructor(store?: RateLimitStore) {
    this.store = store || new MemoryRateLimitStore()
  }

  async checkRateLimit(
    key: string,
    maxRequests: number,
    windowMs: number
  ): Promise<{ 
    allowed: boolean
    count: number
    remaining: number
    resetTime: number
  }> {
    const entry = await this.store.increment(key, windowMs)
    
    return {
      allowed: entry.count <= maxRequests,
      count: entry.count,
      remaining: Math.max(0, maxRequests - entry.count),
      resetTime: entry.resetTime,
    }
  }

  generateKey(request: NextRequest, strategy: string): string {
    switch (strategy) {
      case 'ip':
        return this.getClientIP(request)
      case 'user-agent':
        return request.headers.get('user-agent') || 'unknown'
      case 'api-key':
        return request.headers.get('x-api-key') || 'anonymous'
      default:
        return this.getClientIP(request)
    }
  }

  private getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : 
               request.headers.get('x-real-ip') || 
               'unknown'
    return ip.trim()
  }
}

// ================================
// 4. THREAT PROTECTION
// ================================

export class ThreatProtector {
  private suspiciousIPs = new Map<string, { count: number; lastActivity: number }>()
  private blockedIPs = new Set<string>()

  constructor(private config: WebhookSecurityConfig['threatProtection']) {}

  async analyzeRequest(request: NextRequest): Promise<{
    threat: boolean
    reason?: string
    severity: 'low' | 'medium' | 'high' | 'critical'
  }> {
    const clientIP = this.getClientIP(request)
    const userAgent = request.headers.get('user-agent') || ''

    // Check blocked IPs
    if (this.blockedIPs.has(clientIP)) {
      return { 
        threat: true, 
        reason: 'IP address is blocked', 
        severity: 'critical' 
      }
    }

    // Check suspicious activity
    const suspiciousActivity = await this.detectSuspiciousActivity(clientIP)
    if (suspiciousActivity.isSuspicious) {
      return {
        threat: true,
        reason: `Suspicious activity detected: ${suspiciousActivity.reason}`,
        severity: 'high'
      }
    }

    // Check malicious user agents
    if (this.isMaliciousUserAgent(userAgent)) {
      return {
        threat: true,
        reason: 'Malicious user agent detected',
        severity: 'medium'
      }
    }

    // Check request patterns
    const patternThreat = await this.analyzeRequestPatterns(request)
    if (patternThreat.threat) {
      return patternThreat
    }

    return { threat: false, severity: 'low' }
  }

  private async detectSuspiciousActivity(ip: string): Promise<{
    isSuspicious: boolean
    reason?: string
  }> {
    const activity = this.suspiciousIPs.get(ip)
    const now = Date.now()
    const windowMs = 60000 // 1 minute

    if (!activity) {
      this.suspiciousIPs.set(ip, { count: 1, lastActivity: now })
      return { isSuspicious: false }
    }

    // Reset if outside time window
    if (now - activity.lastActivity > windowMs) {
      this.suspiciousIPs.set(ip, { count: 1, lastActivity: now })
      return { isSuspicious: false }
    }

    // Increment count
    activity.count++
    activity.lastActivity = now

    if (activity.count > this.config.suspiciousActivityThreshold) {
      // Block IP temporarily
      this.blockIP(ip, this.config.blockDuration)
      return {
        isSuspicious: true,
        reason: `Too many requests: ${activity.count} in 1 minute`
      }
    }

    return { isSuspicious: false }
  }

  private isMaliciousUserAgent(userAgent: string): boolean {
    const maliciousPatterns = [
      /bot/i,
      /crawler/i,
      /scanner/i,
      /curl/i,
      /wget/i,
      /python-requests/i,
      // Add more patterns as needed
    ]

    // Check against config blacklist
    const blacklist = this.config as any // Type assertion for demo
    if (blacklist?.userAgentBlacklist) {
      for (const pattern of blacklist.userAgentBlacklist) {
        if (new RegExp(pattern, 'i').test(userAgent)) {
          return true
        }
      }
    }

    return maliciousPatterns.some(pattern => pattern.test(userAgent))
  }

  private async analyzeRequestPatterns(request: NextRequest): Promise<{
    threat: boolean
    reason?: string
    severity: 'low' | 'medium' | 'high' | 'critical'
  }> {
    const contentLength = parseInt(request.headers.get('content-length') || '0')
    
    // Check for abnormally large payloads
    if (contentLength > 10 * 1024 * 1024) { // 10MB
      return {
        threat: true,
        reason: `Abnormally large payload: ${contentLength} bytes`,
        severity: 'high'
      }
    }

    // Check for suspicious headers
    const suspiciousHeaders = [
      'x-forwarded-host',
      'x-cluster-client-ip',
      'x-real-ip'
    ]

    for (const header of suspiciousHeaders) {
      const value = request.headers.get(header)
      if (value && this.containsSuspiciousContent(value)) {
        return {
          threat: true,
          reason: `Suspicious header content: ${header}`,
          severity: 'medium'
        }
      }
    }

    return { threat: false, severity: 'low' }
  }

  private containsSuspiciousContent(content: string): boolean {
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /onclick/i,
      /onerror/i,
      /eval\(/i,
      /document\./i,
      /window\./i,
    ]

    return suspiciousPatterns.some(pattern => pattern.test(content))
  }

  private blockIP(ip: string, duration: number): void {
    this.blockedIPs.add(ip)
    setTimeout(() => {
      this.blockedIPs.delete(ip)
    }, duration)

    // Emit threat event
    webhookRegistry.emitEvent({
      type: 'custom',
      source: 'threat-protection',
      data: {
        action: 'ip_blocked',
        ip,
        duration,
        reason: 'Suspicious activity threshold exceeded',
      },
    })
  }

  private getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for')
    return forwarded ? forwarded.split(',')[0].trim() : 'unknown'
  }
}

// ================================
// 5. SECURITY MANAGER
// ================================

export class WebhookSecurityManager {
  private authHandlers = new Map<string, AuthenticationHandler>()
  private rateLimiter: RateLimiter
  private threatProtector: ThreatProtector

  constructor(private config: WebhookSecurityConfig) {
    // Register authentication handlers
    this.authHandlers.set('hmac-sha256', new HMACAuthHandler())
    this.authHandlers.set('bearer-token', new BearerTokenAuthHandler())
    this.authHandlers.set('api-key', new APIKeyAuthHandler())
    this.authHandlers.set('oauth2', new OAuth2AuthHandler())

    // Initialize components
    this.rateLimiter = new RateLimiter()
    this.threatProtector = new ThreatProtector(config.threatProtection)
  }

  async validateRequest(request: NextRequest): Promise<{
    valid: boolean
    errors: string[]
    identity?: string
    metadata?: Record<string, any>
  }> {
    const errors: string[] = []
    let identity: string | undefined
    const metadata: Record<string, any> = {}

    try {
      // 1. Threat Protection
      const threatAnalysis = await this.threatProtector.analyzeRequest(request)
      if (threatAnalysis.threat) {
        errors.push(`Threat detected: ${threatAnalysis.reason}`)
        metadata.threatLevel = threatAnalysis.severity
      }

      // 2. Rate Limiting
      if (this.config.rateLimiting.enabled) {
        const key = this.rateLimiter.generateKey(request, this.config.rateLimiting.keyGenerator)
        const rateResult = await this.rateLimiter.checkRateLimit(
          key,
          this.config.rateLimiting.maxRequests,
          this.config.rateLimiting.windowMs
        )

        metadata.rateLimit = {
          count: rateResult.count,
          remaining: rateResult.remaining,
          resetTime: rateResult.resetTime,
        }

        if (!rateResult.allowed) {
          errors.push(`Rate limit exceeded: ${rateResult.count}/${this.config.rateLimiting.maxRequests}`)
        }
      }

      // 3. Request Validation
      const validationErrors = await this.validateRequestFormat(request)
      errors.push(...validationErrors)

      // 4. Authentication
      if (this.config.authentication.required) {
        const authResult = await this.authenticateRequest(request)
        if (!authResult.success) {
          errors.push(`Authentication failed: ${authResult.error}`)
        } else {
          identity = authResult.identity
          metadata.auth = authResult.metadata
        }
      }

      // 5. Log request
      if (this.config.logging.logAllRequests) {
        await this.logRequest(request, errors.length === 0, identity)
      }

      return {
        valid: errors.length === 0,
        errors,
        identity,
        metadata,
      }

    } catch (error) {
      errors.push(`Security validation error: ${error}`)
      return { valid: false, errors }
    }
  }

  private async authenticateRequest(request: NextRequest): Promise<AuthResult> {
    for (const method of this.config.authentication.methods) {
      const handler = this.authHandlers.get(method)
      if (!handler) {
        continue
      }

      const config = this.getAuthConfig(method)
      if (!config) {
        continue
      }

      try {
        const result = await handler.authenticate(request, config)
        if (result.success) {
          return result
        }
      } catch (error) {
        console.error(`Authentication method ${method} failed:`, error)
      }
    }

    return { success: false, error: 'No valid authentication method succeeded' }
  }

  private getAuthConfig(method: string): any {
    switch (method) {
      case 'hmac-sha256':
        return this.config.authentication.hmac
      case 'bearer-token':
        return this.config.authentication.bearer
      case 'api-key':
        return this.config.authentication.apiKey
      case 'oauth2':
        return (this.config.authentication as any).oauth2
      default:
        return null
    }
  }

  private async validateRequestFormat(request: NextRequest): Promise<string[]> {
    const errors: string[] = []

    // Content type validation
    const contentType = request.headers.get('content-type')
    if (contentType && !this.config.validation.allowedContentTypes.includes(contentType)) {
      errors.push(`Invalid content type: ${contentType}`)
    }

    // Required headers validation
    for (const header of this.config.validation.requiredHeaders) {
      if (!request.headers.get(header)) {
        errors.push(`Missing required header: ${header}`)
      }
    }

    // Body size validation
    const contentLength = parseInt(request.headers.get('content-length') || '0')
    if (contentLength > this.config.validation.maxBodySize) {
      errors.push(`Request body too large: ${contentLength} bytes`)
    }

    // IP whitelist/blacklist validation
    const clientIP = this.getClientIP(request)
    
    if (this.config.validation.ipWhitelist && this.config.validation.ipWhitelist.length > 0) {
      if (!this.config.validation.ipWhitelist.includes(clientIP)) {
        errors.push(`IP not in whitelist: ${clientIP}`)
      }
    }

    if (this.config.validation.ipBlacklist?.includes(clientIP)) {
      errors.push(`IP in blacklist: ${clientIP}`)
    }

    return errors
  }

  private async logRequest(
    request: NextRequest,
    success: boolean,
    identity?: string
  ): Promise<void> {
    const logEntry = {
      timestamp: new Date().toISOString(),
      method: request.method,
      url: request.url,
      headers: Object.fromEntries(request.headers.entries()),
      clientIP: this.getClientIP(request),
      userAgent: request.headers.get('user-agent'),
      success,
      identity,
      // Only log payload if configured and safe
      payload: this.config.logging.logPayloads ? await this.getSafePayload(request) : undefined,
    }

    // In production, this would go to your logging system
    console.log('Webhook Security Log:', JSON.stringify(logEntry, null, 2))

    // Emit log event
    webhookRegistry.emitEvent({
      type: 'custom',
      source: 'webhook-security',
      data: {
        action: 'request_logged',
        success,
        identity,
        ip: logEntry.clientIP,
      },
    })
  }

  private async getSafePayload(request: NextRequest): Promise<any> {
    try {
      const text = await request.text()
      // Truncate large payloads and sanitize sensitive data
      const maxLength = 1000
      const sanitized = text.length > maxLength ? text.substring(0, maxLength) + '...' : text
      
      // Remove potential sensitive data patterns
      return sanitized.replace(/(password|secret|key|token)["':][\s]*["'][^"']*["']/gi, '$1:"[REDACTED]"')
    } catch {
      return '[Unable to parse payload]'
    }
  }

  private getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for')
    return forwarded ? forwarded.split(',')[0].trim() : 'unknown'
  }
}

// ================================
// 6. SECURITY MIDDLEWARE
// ================================

export function createWebhookSecurityMiddleware(config: WebhookSecurityConfig) {
  const securityManager = new WebhookSecurityManager(config)

  return async (request: NextRequest) => {
    const validation = await securityManager.validateRequest(request)
    
    if (!validation.valid) {
      return {
        allowed: false,
        errors: validation.errors,
        statusCode: 403,
      }
    }

    return {
      allowed: true,
      identity: validation.identity,
      metadata: validation.metadata,
    }
  }
}

// ================================
// 7. DEFAULT CONFIGURATIONS
// ================================

export const DEFAULT_SECURITY_CONFIG: WebhookSecurityConfig = {
  authentication: {
    required: true,
    methods: ['hmac-sha256'],
    hmac: {
      secretKey: process.env.WEBHOOK_SECRET || 'default-secret-change-in-production',
      algorithm: 'sha256',
      headerName: 'x-webhook-signature',
    },
  },
  rateLimiting: {
    enabled: true,
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 1000,
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
    keyGenerator: 'ip',
  },
  validation: {
    maxBodySize: 1024 * 1024, // 1MB
    allowedContentTypes: ['application/json'],
    requiredHeaders: [],
  },
  threatProtection: {
    enableDDoSProtection: true,
    suspiciousActivityThreshold: 100,
    blockDuration: 3600000, // 1 hour
    enableGeoBlocking: false,
    blockedCountries: [],
  },
  logging: {
    logAllRequests: true,
    logPayloads: false,
    logFailedAuth: true,
    retentionDays: 30,
  },
  cors: {
    enabled: true,
    allowedOrigins: ['*'],
    allowedMethods: ['POST', 'PUT'],
    allowedHeaders: ['content-type', 'authorization', 'x-webhook-signature', 'x-api-key'],
  },
}

// ================================
// 8. EXPORTS & INITIALIZATION
// ================================

export const webhookSecurity = {
  createMiddleware: createWebhookSecurityMiddleware,
  defaultConfig: DEFAULT_SECURITY_CONFIG,
  
  // Helper functions
  generateWebhookSecret: () => randomBytes(32).toString('hex'),
  generateAPIKey: () => randomBytes(24).toString('base64url'),
  
  // Validation helpers
  validateConfig: (config: unknown) => WebhookSecurityConfigSchema.parse(config),
}