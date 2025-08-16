│  index.html
│  main.ts
│  manifest.webmanifest
│  ngsw-config.json
│  styles.scss
│
├─app
│  │  app.component.ts
│  │  app.config.ts
│  │  app.routes.ts
│  │  index.ts
│  │
│  ├─application
│  │  │  index.ts
│  │  │
│  │  ├─commands
│  │  │  │  index.ts
│  │  │  │
│  │  │  ├─auth
│  │  │  │      index.ts
│  │  │  │
│  │  │  ├─organization
│  │  │  │      index.ts
│  │  │  │
│  │  │  ├─permission
│  │  │  │      index.ts
│  │  │  │
│  │  │  └─user
│  │  │          index.ts
│  │  │
│  │  ├─dto
│  │  │  │  auth.dto.ts
│  │  │  │  index.ts
│  │  │  │  user.dto.ts
│  │  │  │
│  │  │  ├─auth
│  │  │  │      index.ts
│  │  │  │
│  │  │  ├─organization
│  │  │  │      index.ts
│  │  │  │
│  │  │  ├─permission
│  │  │  │      index.ts
│  │  │  │
│  │  │  └─user
│  │  │          index.ts
│  │  │
│  │  ├─exceptions
│  │  │  │  index.ts
│  │  │  │
│  │  │  ├─auth
│  │  │  │      index.ts
│  │  │  │
│  │  │  ├─common
│  │  │  │      index.ts
│  │  │  │
│  │  │  ├─organization
│  │  │  │      index.ts
│  │  │  │
│  │  │  ├─permission
│  │  │  │      index.ts
│  │  │  │
│  │  │  └─user
│  │  │          index.ts
│  │  │
│  │  ├─mappers
│  │  │  │  index.ts
│  │  │  │
│  │  │  ├─auth
│  │  │  │      index.ts
│  │  │  │
│  │  │  ├─organization
│  │  │  │      index.ts
│  │  │  │
│  │  │  ├─permission
│  │  │  │      index.ts
│  │  │  │
│  │  │  └─user
│  │  │          index.ts
│  │  │
│  │  ├─queries
│  │  │      index.ts
│  │  │
│  │  ├─services
│  │  │  │  auth.service.ts
│  │  │  │  index.ts
│  │  │  │  user-application.service.ts
│  │  │  │  user.service.ts
│  │  │  │
│  │  │  ├─app-shell
│  │  │  │      app-shell.service.ts
│  │  │  │      index.ts
│  │  │  │      offline.service.ts
│  │  │  │
│  │  │  ├─auth
│  │  │  │      index.ts
│  │  │  │
│  │  │  ├─organization
│  │  │  │      index.ts
│  │  │  │
│  │  │  ├─permission
│  │  │  │      index.ts
│  │  │  │
│  │  │  ├─tab-navigation
│  │  │  │      index.ts
│  │  │  │      tab-navigation.service.ts
│  │  │  │
│  │  │  └─user
│  │  │          index.ts
│  │  │
│  │  ├─use-cases
│  │  │  │  index.ts
│  │  │  │  login.use-case.ts
│  │  │  │  register.use-case.ts
│  │  │  │
│  │  │  ├─auth
│  │  │  │      index.ts
│  │  │  │
│  │  │  ├─organization
│  │  │  │      index.ts
│  │  │  │
│  │  │  ├─permission
│  │  │  │      index.ts
│  │  │  │
│  │  │  └─user
│  │  │          index.ts
│  │  │
│  │  └─validators
│  │      │  index.ts
│  │      │
│  │      ├─auth
│  │      │      index.ts
│  │      │
│  │      ├─organization
│  │      │      index.ts
│  │      │
│  │      ├─permission
│  │      │      index.ts
│  │      │
│  │      └─user
│  │              index.ts
│  │
│  ├─core
│  │  │  guards.ts
│  │  │  index.ts
│  │  │  interceptors.ts
│  │  │  services.ts
│  │  │
│  │  ├─i18n
│  │  │      i18n.service.ts
│  │  │      index.ts
│  │  │
│  │  ├─net
│  │  │      default.interceptor.ts
│  │  │      index.ts
│  │  │      refresh-token.service.ts
│  │  │
│  │  └─startup
│  │          index.ts
│  │          startup.service.ts
│  │
│  ├─domain
│  │  │  index.ts
│  │  │
│  │  ├─aggregates
│  │  │  │  index.ts
│  │  │  │
│  │  │  ├─organization
│  │  │  └─user-account
│  │  ├─base
│  │  │      base.entity.ts
│  │  │      index.ts
│  │  │
│  │  ├─entities
│  │  │  ├─app-shell
│  │  │  │      app-shell.entity.ts
│  │  │  │      app-shell.factory.ts
│  │  │  │      index.ts
│  │  │  │
│  │  │  ├─base
│  │  │  │      index.ts
│  │  │  │
│  │  │  ├─organization
│  │  │  ├─permission
│  │  │  ├─role
│  │  │  └─user
│  │  │          index.ts
│  │  │          user.entity.ts
│  │  │
│  │  ├─events
│  │  │      index.ts
│  │  │
│  │  ├─exceptions
│  │  │      index.ts
│  │  │
│  │  ├─repositories
│  │  │      index.ts
│  │  │      user.repository.ts
│  │  │
│  │  ├─services
│  │  │      auth.domain.service.ts
│  │  │      index.ts
│  │  │
│  │  ├─specifications
│  │  │      index.ts
│  │  │
│  │  └─value-objects
│  │      │  index.ts
│  │      │
│  │      ├─email
│  │      │      email.vo.ts
│  │      │      index.ts
│  │      │
│  │      ├─money
│  │      ├─password
│  │      └─uuid
│  ├─infrastructure
│  │  │  index.ts
│  │  │
│  │  ├─caching
│  │  │      cache.service.ts
│  │  │      index.ts
│  │  │
│  │  ├─config
│  │  │  │  environment.service.ts
│  │  │  │  index.ts
│  │  │  │
│  │  │  └─firebase
│  │  │          firebase.config.ts
│  │  │          index.ts
│  │  │
│  │  ├─exceptions
│  │  │      index.ts
│  │  │
│  │  ├─external-services
│  │  │  │  index.ts
│  │  │  │
│  │  │  └─pwa
│  │  │          index.ts
│  │  │          service-worker.service.ts
│  │  │
│  │  ├─interceptors
│  │  │      auth.interceptor.ts
│  │  │      error.interceptor.ts
│  │  │      logging.interceptor.ts
│  │  │
│  │  ├─logging
│  │  │      index.ts
│  │  │      logger.service.ts
│  │  │
│  │  ├─messaging
│  │  │      index.ts
│  │  │
│  │  ├─monitoring
│  │  │      index.ts
│  │  │
│  │  └─persistence
│  │      │  index.ts
│  │      │
│  │      ├─firebase
│  │      │      firebase-auth.service.ts
│  │      │      firebase.service.ts
│  │      │      firestore.service.ts
│  │      │      index.ts
│  │      │
│  │      └─repositories
│  │          └─firebase
│  │              │  firebase-base.repository.ts
│  │              │  index.ts
│  │              │
│  │              └─user
│  │                      index.ts
│  │                      user.firebase.repository.ts
│  │
│  ├─interface
│  │  │  index.ts
│  │  │
│  │  ├─components
│  │  │  │  index.ts
│  │  │  │
│  │  │  ├─common
│  │  │  │  │  index.ts
│  │  │  │  │
│  │  │  │  ├─button
│  │  │  │  │      button.component.ts
│  │  │  │  │      index.ts
│  │  │  │  │
│  │  │  │  ├─input
│  │  │  │  │      index.ts
│  │  │  │  │      input.component.ts
│  │  │  │  │
│  │  │  │  ├─modal
│  │  │  │  │      index.ts
│  │  │  │  │      modal.component.ts
│  │  │  │  │
│  │  │  │  └─tab-navigation
│  │  │  │          index.ts
│  │  │  │          tab-navigation.component.scss
│  │  │  │          tab-navigation.component.ts
│  │  │  │
│  │  │  ├─forms
│  │  │  │  │  index.ts
│  │  │  │  │
│  │  │  │  ├─login-form
│  │  │  │  │      index.ts
│  │  │  │  │      login-form.component.ts
│  │  │  │  │
│  │  │  │  └─user-form
│  │  │  │          index.ts
│  │  │  │          user-form.component.ts
│  │  │  │
│  │  │  ├─layout
│  │  │  │  │  index.ts
│  │  │  │  │
│  │  │  │  ├─app-shell
│  │  │  │  │      app-shell.component.spec.ts
│  │  │  │  │      app-shell.component.ts
│  │  │  │  │      index.ts
│  │  │  │  │
│  │  │  │  ├─footer
│  │  │  │  │      footer.component.ts
│  │  │  │  │      index.ts
│  │  │  │  │
│  │  │  │  ├─header
│  │  │  │  │      header.component.ts
│  │  │  │  │      index.ts
│  │  │  │  │
│  │  │  │  └─sidebar
│  │  │  │          index.ts
│  │  │  │          sidebar.component.ts
│  │  │  │
│  │  │  └─widgets
│  │  │      │  index.ts
│  │  │      │
│  │  │      ├─data-table
│  │  │      │      data-table.component.ts
│  │  │      │      index.ts
│  │  │      │
│  │  │      └─user-card
│  │  │              index.ts
│  │  │              user-card.component.ts
│  │  │
│  │  ├─controllers
│  │  │      index.ts
│  │  │
│  │  ├─directives
│  │  │      index.ts
│  │  │
│  │  ├─exceptions
│  │  │      index.ts
│  │  │
│  │  ├─guards
│  │  │      index.ts
│  │  │
│  │  ├─interceptors
│  │  │      index.ts
│  │  │
│  │  ├─layouts
│  │  │  │  index.ts
│  │  │  │
│  │  │  ├─basic
│  │  │  │      basic.layout.ts
│  │  │  │      index.ts
│  │  │  │
│  │  │  ├─blank
│  │  │  │      blank.layout.ts
│  │  │  │      index.ts
│  │  │  │
│  │  │  ├─dashboard
│  │  │  │      dashboard.layout.ts
│  │  │  │      index.ts
│  │  │  │
│  │  │  └─passport
│  │  │          index.ts
│  │  │          passport.layout.ts
│  │  │
│  │  ├─pages
│  │  │  │  index.ts
│  │  │  │
│  │  │  ├─app-shell-demo
│  │  │  │      app-shell-demo.page.ts
│  │  │  │      index.ts
│  │  │  │
│  │  │  ├─auth
│  │  │  │  │  index.ts
│  │  │  │  │
│  │  │  │  ├─login
│  │  │  │  │      index.ts
│  │  │  │  │      login.page.ts
│  │  │  │  │
│  │  │  │  └─register
│  │  │  │          index.ts
│  │  │  │          register.page.ts
│  │  │  │
│  │  │  ├─dashboard
│  │  │  │      dashboard.page.ts
│  │  │  │      index.ts
│  │  │  │
│  │  │  ├─tab-demo
│  │  │  │      index.ts
│  │  │  │      tab-demo.page.scss
│  │  │  │      tab-demo.page.ts
│  │  │  │
│  │  │  └─user
│  │  │      │  index.ts
│  │  │      │
│  │  │      ├─user-detail
│  │  │      │      index.ts
│  │  │      │      user-detail.page.ts
│  │  │      │
│  │  │      └─user-list
│  │  │              index.ts
│  │  │              user-list.page.ts
│  │  │
│  │  ├─pipes
│  │  │      index.ts
│  │  │
│  │  └─resolvers
│  │          index.ts
│  │
│  ├─modules
│  │  │  auth.module.ts
│  │  │  index.ts
│  │  │  user.module.ts
│  │  │
│  │  └─app-shell
│  │          app-shell.module.ts
│  │          index.ts
│  │
│  ├─security
│  │  │  index.ts
│  │  │
│  │  ├─audit
│  │  │      index.ts
│  │  │
│  │  ├─authentication
│  │  │  │  index.ts
│  │  │  │
│  │  │  ├─guards
│  │  │  │      auth.guard.ts
│  │  │  │      index.ts
│  │  │  │
│  │  │  └─services
│  │  │          authentication.service.ts
│  │  │          firebase-auth.service.ts
│  │  │          index.ts
│  │  │
│  │  ├─authorization
│  │  │      index.ts
│  │  │
│  │  ├─encryption
│  │  │      index.ts
│  │  │
│  │  ├─exceptions
│  │  │      index.ts
│  │  │
│  │  ├─jwt
│  │  │      index.ts
│  │  │
│  │  ├─rate-limiting
│  │  │      index.ts
│  │  │
│  │  └─validation
│  │          index.ts
│  │
│  └─shared
│      │  index.ts
│      │
│      ├─base
│      │  │  index.ts
│      │  │
│      │  └─entities
│      │          base.entity.ts
│      │          index.ts
│      │
│      ├─components
│      │  │  index.ts
│      │  │
│      │  ├─material
│      │  │      cdk-accordion-item.component.ts
│      │  │      cdk-accordion.component.ts
│      │  │      cdk-cell.component.ts
│      │  │      cdk-column-def.component.ts
│      │  │      cdk-dialog-container.component.ts
│      │  │      cdk-dialog.component.ts
│      │  │      cdk-footer-row.component.ts
│      │  │      cdk-harness.component.ts
│      │  │      cdk-header-row.component.ts
│      │  │      cdk-keycodes.component.ts
│      │  │      cdk-listbox.component.ts
│      │  │      cdk-menu-item.component.ts
│      │  │      cdk-menu-trigger.component.ts
│      │  │      cdk-menu.component.ts
│      │  │      cdk-option.component.ts
│      │  │      cdk-row.component.ts
│      │  │      cdk-step.component.ts
│      │  │      cdk-stepper.component.ts
│      │  │      cdk-table.component.ts
│      │  │      cdk-testbed.component.ts
│      │  │      cdk-testing.component.ts
│      │  │      cdk-text-column.component.ts
│      │  │      cdk-tree-node-outlet.component.ts
│      │  │      cdk-tree-node.component.ts
│      │  │      cdk-tree.component.ts
│      │  │      cdk-version.component.ts
│      │  │      index.ts
│      │  │      mat-action-list.component.ts
│      │  │      mat-autocomplete.component.ts
│      │  │      mat-button-toggle.component.ts
│      │  │      mat-button.component.ts
│      │  │      mat-card-title-group.component.ts
│      │  │      mat-card.component.ts
│      │  │      mat-checkbox.component.ts
│      │  │      mat-chip-listbox.component.ts
│      │  │      mat-chips.component.ts
│      │  │      mat-datepicker.component.ts
│      │  │      mat-dialog.component.ts
│      │  │      mat-divider.component.ts
│      │  │      mat-expansion-panel.component.ts
│      │  │      mat-fab.component.ts
│      │  │      mat-form-field.component.ts
│      │  │      mat-grid-list.component.ts
│      │  │      mat-grid-tile.component.ts
│      │  │      mat-icon-button.component.ts
│      │  │      mat-input.component.ts
│      │  │      mat-list-item.component.ts
│      │  │      mat-list.component.ts
│      │  │      mat-menu-item.component.ts
│      │  │      mat-menu.component.ts
│      │  │      mat-nav-list.component.ts
│      │  │      mat-optgroup.component.ts
│      │  │      mat-option.component.ts
│      │  │      mat-radio-button.component.ts
│      │  │      mat-select.component.ts
│      │  │      mat-selection-list.component.ts
│      │  │      mat-sidenav.component.ts
│      │  │      mat-slide-toggle.component.ts
│      │  │      mat-slider.component.ts
│      │  │      mat-snack-bar.component.ts
│      │  │      mat-stepper.component.ts
│      │  │      mat-table.component.ts
│      │  │      mat-tabs.component.ts
│      │  │      mat-text-column.component.ts
│      │  │      mat-toolbar.component.ts
│      │  │      mat-tooltip.component.ts
│      │  │      mat-tree.component.ts
│      │  │      README.md
│      │  │
│      │  └─sidebar
│      │          index.ts
│      │          sidebar.component.html
│      │          sidebar.component.scss
│      │          sidebar.component.ts
│      │
│      ├─constants
│      │  │  index.ts
│      │  │  sidebar.constants.ts
│      │  │
│      │  └─tab
│      │          index.ts
│      │          tab.constants.ts
│      │
│      ├─decorators
│      │      index.ts
│      │
│      ├─directives
│      │      index.ts
│      │
│      ├─enums
│      │  │  index.ts
│      │  │
│      │  └─common
│      │          index.ts
│      │
│      ├─exceptions
│      │      index.ts
│      │
│      ├─i18n
│      │      index.ts
│      │
│      ├─interfaces
│      │  │  index.ts
│      │  │  sidebar.interface.ts
│      │  │
│      │  ├─app-shell
│      │  │      app-shell.interface.ts
│      │  │      index.ts
│      │  │      offline.interface.ts
│      │  │
│      │  └─tab
│      │          index.ts
│      │          tab.interface.ts
│      │
│      ├─models
│      │      index.ts
│      │
│      ├─pipes
│      │      index.ts
│      │
│      ├─services
│      │  │  cache.service.ts
│      │  │  index.ts
│      │  │
│      │  └─material
│      │          index.ts
│      │          material-layout.service.ts
│      │          material-theme.service.ts
│      │
│      ├─types
│      │      index.ts
│      │
│      ├─utils
│      │  │  index.ts
│      │  │  storage.util.ts
│      │  │
│      │  └─tab
│      │          index.ts
│      │          tab.util.ts
│      │
│      └─validators
│              index.ts
│
├─assets
│  │  index.ts
│  │
│  ├─data
│  │      index.ts
│  │
│  ├─fonts
│  │      index.ts
│  │
│  ├─icons
│  │      icon-128x128.png
│  │      icon-144x144.png
│  │      icon-152x152.png
│  │      icon-192x192.png
│  │      icon-384x384.png
│  │      icon-512x512.png
│  │      icon-72x72.png
│  │      icon-96x96.png
│  │      index.ts
│  │
│  └─images
│          index.ts
│
├─environments
│      environment.prod.ts
│      environment.ts
│
└─styles
    └─app-shell
            index.scss
            _app-shell-variables.scss
