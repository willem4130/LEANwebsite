<metadata>
purpose: Quick reference to prevent development blunders through rapid assessment
type: quick-reference
language: decision-framework
dependencies: none
last-updated: 2025-01-23
</metadata>

<overview>
Emergency quick reference to prevent building inferior features while ignoring existing masterpieces. Use BEFORE any development work begins.
</overview>

<emergency-checklist>
<step id="1" time="2-minutes">
  <action>Run: `find src/app -name "page.tsx" | head -10`</action>
  <purpose>Discover all existing pages</purpose>
  <decision>If pages exist covering similar functionality → INVESTIGATE FIRST</decision>
</step>

<step id="2" time="3-minutes">
  <action>Check /demo page and major components</action>
  <purpose>Assess existing sophistication level</purpose>
  <decision>If Hollywood-level effects exist → STOP BUILDING, START SELLING</decision>
</step>

<step id="3" time="2-minutes">
  <action>Run: `grep -r "gsap\|animation" src/ | wc -l`</action>
  <purpose>Count existing animation implementations</purpose>
  <decision>If >50 lines → Existing animation system may meet needs</decision>
</step>

<step id="4" time="1-minute">
  <action>Ask: "Is this 60%+ already built?"</action>
  <purpose>Rapid duplication assessment</purpose>
  <decision>If YES → Enhance existing, don't rebuild</decision>
</step>

<step id="5" time="1-minute">
  <action>Ask: "Could existing work be marketed today?"</action>
  <purpose>Market-readiness reality check</purpose>
  <decision>If YES → STOP development, focus on sales/marketing</decision>
</step>
</emergency-checklist>

<red-flags>
<flag severity="CRITICAL">
  <indicator>Building "prototype" when demo pages exist</indicator>
  <action>STOP IMMEDIATELY - Check demo page sophistication</action>
</flag>

<flag severity="HIGH">
  <indicator>Recreating animations that already exist</indicator>
  <action>Audit existing animation libraries first</action>
</flag>

<flag severity="HIGH">
  <indicator>Building from scratch without component audit</indicator>
  <action>Run component inventory before coding</action>
</flag>

<flag severity="MEDIUM">
  <indicator>Estimating >1 day work without checking existing</indicator>
  <action>Asset audit required for any significant development</action>
</flag>
</red-flags>

<decision-shortcuts>
<scenario condition="existing-has-advanced-gsap">
  <verdict>ENHANCE - Don't rebuild animation systems</verdict>
  <time-saved>80%+ development time</time-saved>
</scenario>

<scenario condition="demo-page-exists-with-effects">
  <verdict>MARKET - Demo IS the product</verdict>
  <time-saved>100% development time</time-saved>
</scenario>

<scenario condition="components-cover-80-percent">
  <verdict>INTEGRATE - Build missing 20% only</verdict>
  <time-saved>60%+ development time</time-saved>
</scenario>

<scenario condition="production-ready-exists">
  <verdict>SELL - Stop building, start selling</verdict>
  <time-saved>100% + immediate revenue</time-saved>
</scenario>
</decision-shortcuts>

<quick-commands>
<command name="audit" usage="Before any development">
  <syntax>find src -name "*.tsx" | grep -E "(demo|prototype)" && ls src/app/*/page.tsx</syntax>
</command>

<command name="animation-check" usage="Before animation work">
  <syntax>grep -r "gsap\|ScrollTrigger\|framer" src/ --include="*.tsx" | head -5</syntax>
</command>

<command name="component-count" usage="Inventory check">
  <syntax>find src/components -name "*.tsx" | wc -l</syntax>
</command>

<command name="market-ready" usage="Deployment assessment">
  <syntax>ls -la src/app/demo/ && echo "Demo page ready for production?"</syntax>
</command>
</quick-commands>

<golden-rules>
<rule id="1">NEVER build without 10-minute existing work audit</rule>
<rule id="2">Demo page with Hollywood effects = STOP building, START selling</rule>
<rule id="3">If existing meets 80% needs = ENHANCE, don't rebuild</rule>
<rule id="4">Advanced GSAP animations = Leverage, don't recreate</rule>
<rule id="5">Production-ready work = Market immediately</rule>
</golden-rules>

<current-project-status>
<demo-page-assessment>
  <sophistication>Hollywood-level (64 3D fragments, reality tears, portal effects)</sophistication>
  <market-value>$50K+ agency equivalent</market-value>
  <status>PRODUCTION READY - MARKET IMMEDIATELY</status>
  <action>STOP all prototype development - Demo IS the prototype</action>
</demo-page-assessment>

<animation-library-status>
  <gsap-integration>Advanced ScrollTrigger, 3D transforms, particle systems</gsap-integration>
  <effect-library>Matrix rain, holographic scans, energy explosions, circuit traces</effect-library>
  <status>COMPREHENSIVE - No need for new animation development</status>
  <action>Leverage existing library for any new features</action>
</animation-library-status>
</current-project-status>

<blunder-recovery>
<if-already-building-inferior>
  <step>STOP development immediately</step>
  <step>Assess existing work sophistication</step>
  <step>Pivot to marketing existing work</step>
  <step>Document lesson learned</step>
</if-already-building-inferior>

<if-considering-rebuild>
  <step>Run 10-minute audit first</step>
  <step>Justify why existing work insufficient</step>
  <step>Get second opinion on decision</step>
  <step>Proceed only if <60% overlap exists</step>
</if-considering-rebuild>
</blunder-recovery>

<success-mantra>
"Before you build, audit what exists. Before you code, check what works. Before you develop, see what ships."
</success-mantra>