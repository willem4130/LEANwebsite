<metadata>
purpose: Technical workflow for extracting reusable components from client projects
type: process-guide
scope: component-development
dependencies: ["framework-evolution-strategy", "project-template"]
last-updated: 2025-01-23
</metadata>

<overview>
Component extraction is the systematic process of identifying, abstracting, and packaging reusable components from successful client implementations. This workflow ensures components are production-validated, properly abstracted, and maintainable across diverse use cases.
</overview>

<extraction-workflow>
<phase name="identification" duration="ongoing">
  <purpose>Continuously identify components ready for extraction during client work</purpose>
  
  <identification-criteria>
    <criterion type="usage-frequency">
      <requirement>Used in 2+ different client projects</requirement>
      <validation>Grep codebase for similar component patterns</validation>
    </criterion>
    
    <criterion type="stability-period">
      <requirement>No structural changes for 30+ days</requirement>
      <validation>Git history analysis of component files</validation>
    </criterion>
    
    <criterion type="abstraction-readiness">
      <requirement>Clear props interface with configurable behavior</requirement>
      <validation>Component accepts diverse configuration without code changes</validation>
    </criterion>
    
    <criterion type="production-validation">
      <requirement>Successfully deployed in live client sites</requirement>
      <validation>Zero critical bugs reported in production</validation>
    </criterion>
  </identification-criteria>
  
  <identification-process>
    <step number="1">Review completed client projects for repeated patterns</step>
    <step number="2">Document component variations and use cases</step>
    <step number="3">Evaluate abstraction complexity vs. reuse benefit</step>
    <step number="4">Add qualifying components to extraction backlog</step>
  </identification-process>
</phase>

<phase name="analysis" duration="1-2-days">
  <purpose>Deep analysis of component structure, dependencies, and abstraction requirements</purpose>
  
  <analysis-checklist>
    <item type="dependencies">
      <check>Map all external dependencies and utilities</check>
      <check>Identify framework-specific vs. generic dependencies</check>
      <check>Document peer dependency requirements</check>
    </item>
    
    <item type="props-interface">
      <check>Catalog all current props across implementations</check>
      <check>Identify required vs. optional configurations</check>
      <check>Design unified props interface for all use cases</check>
    </item>
    
    <item type="styling">
      <check>Document CSS classes and customization points</check>
      <check>Identify theme variables and design tokens</check>
      <check>Plan CSS-in-JS or external stylesheet approach</check>
    </item>
    
    <item type="behavior">
      <check>Document interactive behaviors and state management</check>
      <check>Identify event handlers and callback requirements</check>
      <check>Plan accessibility and keyboard navigation</check>
    </item>
  </analysis-checklist>
  
  <analysis-artifacts>
    <artifact name="component-spec">
      <content>Detailed specification including props, behavior, and styling</content>
      <template>Use COMPONENT_SPEC_TEMPLATE.md</template>
    </artifact>
    
    <artifact name="abstraction-plan">
      <content>Step-by-step plan for abstracting component from client code</content>
      <includes>Breaking changes, migration path, testing strategy</includes>
    </artifact>
    
    <artifact name="dependency-map">
      <content>Complete dependency tree and external requirements</content>
      <includes>Package versions, peer dependencies, optional features</includes>
    </artifact>
  </analysis-artifacts>
</phase>

<phase name="extraction" duration="2-3-days">
  <purpose>Extract component code into reusable package with proper abstraction</purpose>
  
  <extraction-steps>
    <step number="1" name="create-package-structure">
      <action>Set up new component package directory</action>
      <structure>
        /src/
          component.tsx          # Main component
          types.ts              # TypeScript interfaces
          utils.ts              # Helper functions
          styles.css            # Component styles
          index.ts              # Public exports
        /tests/
          component.test.tsx    # Unit tests
          integration.test.tsx  # Integration tests
        package.json            # Package configuration
        README.md               # Usage documentation
      </structure>
    </step>
    
    <step number="2" name="abstract-component-code">
      <action>Extract and generalize component implementation</action>
      <requirements>
        <requirement>Remove client-specific logic and hardcoded values</requirement>
        <requirement>Implement comprehensive props interface</requirement>
        <requirement>Add proper TypeScript types and JSDoc comments</requirement>
        <requirement>Include error boundaries and fallback states</requirement>
      </requirements>
    </step>
    
    <step number="3" name="implement-styling">
      <action>Create flexible styling system</action>
      <approaches>
        <approach name="css-modules">Best for simple components with minimal customization</approach>
        <approach name="styled-components">Best for highly customizable components</approach>
        <approach name="tailwind-classes">Best for utility-first design systems</approach>
      </approaches>
    </step>
    
    <step number="4" name="add-accessibility">
      <action>Implement WCAG 2.1 AA accessibility standards</action>
      <requirements>
        <requirement>Semantic HTML structure and ARIA attributes</requirement>
        <requirement>Keyboard navigation and focus management</requirement>
        <requirement>Screen reader compatibility and announcements</requirement>
        <requirement>High contrast and responsive design support</requirement>
      </requirements>
    </step>
  </extraction-steps>
  
  <quality-gates>
    <gate name="code-review">
      <criteria>Code follows project style guide and best practices</criteria>
      <criteria>TypeScript types are complete and accurate</criteria>
      <criteria>No hardcoded values or client-specific logic</criteria>
    </gate>
    
    <gate name="testing">
      <criteria>Unit test coverage ≥ 90% for component logic</criteria>
      <criteria>Integration tests for all major use cases</criteria>
      <criteria>Visual regression tests for styling variations</criteria>
    </gate>
    
    <gate name="documentation">
      <criteria>Complete API documentation with examples</criteria>
      <criteria>Migration guide from client-specific implementations</criteria>
      <criteria>Troubleshooting guide for common issues</criteria>
    </gate>
  </quality-gates>
</phase>

<phase name="validation" duration="1-2-days">
  <purpose>Validate extracted component works across existing client projects</purpose>
  
  <validation-process>
    <step number="1" name="backward-compatibility">
      <action>Replace client-specific component with extracted version</action>
      <success-criteria>No breaking changes in existing functionality</success-criteria>
    </step>
    
    <step number="2" name="cross-project-testing">
      <action>Test component in all client projects where it's used</action>
      <success-criteria>Visual and functional parity with original implementations</success-criteria>
    </step>
    
    <step number="3" name="performance-validation">
      <action>Measure component performance impact</action>
      <benchmarks>
        <benchmark>Bundle size increase ≤ 10KB gzipped</benchmark>
        <benchmark>Render time within 5% of original</benchmark>
        <benchmark>Memory usage comparable to client-specific version</benchmark>
      </benchmarks>
    </step>
    
    <step number="4" name="accessibility-testing">
      <action>Validate accessibility across different browsers and devices</action>
      <tools>
        <tool>axe-core automated accessibility testing</tool>
        <tool>Screen reader testing (NVDA, VoiceOver)</tool>
        <tool>Keyboard navigation validation</tool>
      </tools>
    </step>
  </validation-process>
</phase>

<phase name="documentation" duration="1-day">
  <purpose>Create comprehensive documentation for component usage and maintenance</purpose>
  
  <documentation-requirements>
    <document name="API-documentation">
      <sections>
        <section name="installation">Package installation and setup instructions</section>
        <section name="basic-usage">Simple examples with common configurations</section>
        <section name="advanced-usage">Complex scenarios and customization options</section>
        <section name="props-reference">Complete props documentation with types</section>
        <section name="styling">Customization approaches and theme integration</section>
      </sections>
    </document>
    
    <document name="migration-guide">
      <purpose>Help existing clients migrate from custom implementations</purpose>
      <includes>
        <include>Breaking changes and their solutions</include>
        <include>Props mapping from old to new interface</include>
        <include>Code examples for common migration scenarios</include>
      </includes>
    </document>
    
    <document name="maintenance-guide">
      <purpose>Guide for future development and version management</purpose>
      <includes>
        <include>Component architecture and design decisions</include>
        <include>Testing strategy and coverage requirements</include>
        <include>Release process and versioning guidelines</include>
      </includes>
    </document>
  </documentation-requirements>
</phase>

<phase name="release" duration="0.5-days">
  <purpose>Package and release component for production use</purpose>
  
  <release-checklist>
    <item>Version number follows semantic versioning (MAJOR.MINOR.PATCH)</item>
    <item>CHANGELOG.md updated with all changes and migration notes</item>
    <item>Package.json dependencies and peer dependencies accurate</item>
    <item>Build pipeline configured for distribution formats (ESM, CJS, UMD)</item>
    <item>TypeScript declaration files generated and included</item>
    <item>README.md contains installation and basic usage examples</item>
    <item>License file included (MIT recommended for open source)</item>
    <item>All tests passing in CI/CD pipeline</item>
    <item>Security scan completed with no high-severity issues</item>
    <item>Package size optimized and within acceptable limits</item>
  </release-checklist>
  
  <distribution-channels>
    <channel name="npm-registry">
      <purpose>Public distribution for external developers</purpose>
      <requirements>Semantic versioning, complete documentation</requirements>
    </channel>
    
    <channel name="internal-registry">
      <purpose>Private distribution for client projects</purpose>
      <requirements>Backward compatibility, migration support</requirements>
    </channel>
    
    <channel name="github-releases">
      <purpose>Source code distribution and issue tracking</purpose>
      <requirements>Tagged releases, changelog, issue templates</requirements>
    </channel>
  </distribution-channels>
</phase>
</extraction-workflow>

<component-abstraction-levels>
<level name="direct-extraction" complexity="low" timeline="1-2-days">
  <description>Components with minimal client-specific logic</description>
  <criteria>
    <criterion>Simple props interface without complex state management</criterion>
    <criterion>No external API dependencies or data fetching</criterion>
    <criterion>Consistent styling across all implementations</criterion>
  </criteria>
  <examples>
    <example>Button components with variant styling</example>
    <example>Card layouts with configurable content</example>
    <example>Icon components with size and color variants</example>
  </examples>
</level>

<level name="moderate-abstraction" complexity="medium" timeline="2-4-days">
  <description>Components requiring generalization and configuration options</description>
  <criteria>
    <criterion>Multiple variations with different behavioral patterns</criterion>
    <criterion>Integration with external libraries or APIs</criterion>
    <criterion>Complex styling systems or theme support needed</criterion>
  </criteria>
  <examples>
    <example>Hero sections with multiple background types and animations</example>
    <example>Form components with validation and submission handling</example>
    <example>Gallery components with different layout algorithms</example>
  </examples>
</level>

<level name="complex-abstraction" complexity="high" timeline="5-7-days">
  <description>Components requiring significant architectural changes</description>
  <criteria>
    <criterion>Heavy client-specific business logic integration</criterion>
    <criterion>Complex state management and data flow</criterion>
    <criterion>Multiple external dependencies and configuration layers</criterion>
  </criteria>
  <examples>
    <example>E-commerce checkout flows with payment integration</example>
    <example>Content management interfaces with CRUD operations</example>
    <example>Real-time collaboration features with WebSocket connections</example>
  </examples>
</level>
</component-abstraction-levels>

<testing-strategy>
<unit-testing>
  <framework>Jest + React Testing Library</framework>
  <coverage-requirement>≥ 90% for component logic</coverage-requirement>
  <test-categories>
    <category name="rendering">Component renders with default and custom props</category>
    <category name="interaction">User interactions trigger expected behaviors</category>
    <category name="edge-cases">Error handling and boundary conditions</category>
    <category name="accessibility">ARIA attributes and keyboard navigation</category>
  </test-categories>
</unit-testing>

<integration-testing>
  <framework>Playwright or Cypress for E2E testing</framework>
  <scope>Component behavior in realistic usage contexts</scope>
  <test-scenarios>
    <scenario>Component integration with different theme providers</scenario>
    <scenario>Component behavior across different viewport sizes</scenario>
    <scenario>Component interaction with external APIs and data sources</scenario>
  </test-scenarios>
</integration-testing>

<visual-regression-testing>
  <framework>Chromatic or Percy for visual diff detection</framework>
  <coverage>All component variants and responsive breakpoints</coverage>
  <automation>Integrated into CI/CD pipeline for automatic validation</automation>
</visual-regression-testing>
</testing-strategy>

<maintenance-guidelines>
<versioning-strategy>
  <major-version>Breaking changes to props interface or behavior</major-version>
  <minor-version>New features and non-breaking enhancements</minor-version>
  <patch-version>Bug fixes and security updates</patch-version>
  <deprecation-policy>6-month notice period for breaking changes</deprecation-policy>
</versioning-strategy>

<support-lifecycle>
  <active-support duration="18-months">Full feature development and bug fixes</active-support>
  <maintenance-support duration="12-months">Security updates and critical bug fixes only</maintenance-support>
  <end-of-life>Component archived with migration recommendations</end-of-life>
</support-lifecycle>

<contribution-guidelines>
  <code-standards>Follow project ESLint and Prettier configurations</code-standards>
  <testing-requirements>All new features must include comprehensive tests</testing-requirements>
  <documentation-requirements>Public API changes require documentation updates</documentation-requirements>
  <review-process>All changes require code review and CI/CD pipeline approval</review-process>
</contribution-guidelines>
</maintenance-guidelines>