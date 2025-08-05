│  index.html
│  main.ts
│  style-icons-auto.ts
│  style-icons.ts
│  styles.less
│  typings.d.ts
│
├─app
│  │  app.component.ts
│  │  app.config.ts
│  │  app.routes.ts
│  │
│  ├─application
│  │  ├─auth
│  │  │      auth.models.ts
│  │  │      login-anonymously.use-case.ts
│  │  │      login-with-google.use-case.ts
│  │  │      login.use-case.ts
│  │  │      logout.use-case.ts
│  │  │
│  │  ├─common
│  │  │      base-application.service.ts
│  │  │
│  │  ├─layout
│  │  │      layout.application.service.ts
│  │  │      layout.dto.ts
│  │  │      tab.application.service.ts
│  │  │      tab.dto.ts
│  │  │
│  │  ├─startup
│  │  │      startup.application.service.ts
│  │  │
│  │  └─user
│  │          user.application.service.ts
│  │          user.dto.ts
│  │
│  ├─domain
│  │  ├─common
│  │  │      base.entity.ts
│  │  │
│  │  ├─errors
│  │  │      custom-errors.ts
│  │  │
│  │  ├─layout
│  │  │      layout.entity.ts
│  │  │      menu.entity.ts
│  │  │      tab.entity.ts
│  │  │
│  │  └─user
│  │          user.entity.ts
│  │
│  ├─infrastructure
│  │  ├─auth
│  │  │      firebase-auth.service.ts
│  │  │
│  │  ├─common
│  │  │      base-firebase.repository.ts
│  │  │
│  │  ├─interceptors
│  │  │      error.interceptor.fn.ts
│  │  │      error.interceptor.ts
│  │  │
│  │  ├─layout
│  │  │      layout.repository.ts
│  │  │      tab.repository.ts
│  │  │
│  │  └─user
│  │          user.repository.ts
│  │
│  ├─presentation
│  │  ├─dashboard
│  │  │      dashboard.component.ts
│  │  │
│  │  ├─layout
│  │  │  ├─basic
│  │  │  │  │  basic.component.ts
│  │  │  │  │
│  │  │  │  └─widgets
│  │  │  │          header-user.component.ts
│  │  │  │
│  │  │  ├─default-layout
│  │  │  │      default-layout.component.html
│  │  │  │      default-layout.component.less
│  │  │  │      default-layout.component.ts
│  │  │  │
│  │  │  ├─header
│  │  │  │      header.component.html
│  │  │  │      header.component.less
│  │  │  │      header.component.ts
│  │  │  │
│  │  │  ├─sidebar
│  │  │  │      sidebar.component.html
│  │  │  │      sidebar.component.less
│  │  │  │      sidebar.component.ts
│  │  │  │
│  │  │  └─tab
│  │  │          tab.component.html
│  │  │          tab.component.less
│  │  │          tab.component.ts
│  │  │
│  │  ├─passport
│  │  │  ├─callback
│  │  │  │      callback.component.ts
│  │  │  │
│  │  │  ├─login
│  │  │  │      login.component.ts
│  │  │  │
│  │  │  ├─login-form
│  │  │  │      login-form.component.html
│  │  │  │      login-form.component.less
│  │  │  │      login-form.component.ts
│  │  │  │
│  │  │  ├─register
│  │  │  │      register.component.ts
│  │  │  │
│  │  │  └─register-form
│  │  │          register-form.component.html
│  │  │          register-form.component.less
│  │  │          register-form.component.ts
│  │  │
│  │  ├─settings
│  │  │      settings.component.ts
│  │  │
│  │  └─user
│  │      └─user-list
│  │              user-list.component.ts
│  │
│  └─shared
│      │  shared-zorro.module.ts
│      │
│      └─services
│              error-handler.service.ts
│              layout.service.ts
│
├─assets
│  │  color.less
│  │  logo-color.svg
│  │  logo-full.svg
│  │  logo.svg
│  │  style.compact.css
│  │  style.dark.css
│  │  zorro.svg
│  │
│  └─tmp
│      ├─i18n
│      │      el-GR.json
│      │      en-US.json
│      │      es-ES.json
│      │      fr-FR.json
│      │      hr-HR.json
│      │      it-IT.json
│      │      ko-KR.json
│      │      pl-PL.json
│      │      sl-SI.json
│      │      tr-TR.json
│      │      zh-CN.json
│      │      zh-TW.json
│      │
│      └─img
│              avatar.jpg
│
├─environments
│      environment.prod.ts
│      environment.ts
│
└─styles
        index.less
        theme.less