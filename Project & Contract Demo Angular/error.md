Windows PowerShell
著作權（C） Microsoft Corporation。保留擁有權利。

安裝最新的 PowerShell 以取得新功能和改進功能！https://aka.ms/PSWindows

PS D:\firebase\ng-ac\Project & Contract Demo Angular> npm run start

> project-contract-demo-angular@1.0.0 start
> ng serve

✔ Browser application bundle generation complete.

Initial chunk files                                                                                     | Names                                               |  Raw size
vendor.js                                                                                               | vendor                                              |   5.42 MB |
polyfills.js                                                                                            | polyfills                                           | 241.06 kB |
styles.css, styles.js                                                                                   | styles                                              | 137.96 kB |
runtime.js                                                                                              | runtime                                             |  12.95 kB |
main.js                                                                                                 | main                                                |  11.22 kB |

                                                                                                        | Initial total                                       |   5.82 MB

Lazy chunk files                                                                                        | Names                                               |  Raw size
src_app_interface_pages_projects_projects_page_ts.js                                                    | interface-pages-projects-projects-page              | 695.84 kB |
src_app_interface_layouts_main-layout_main-layout_component_ts.js                                       | interface-layouts-main-layout-main-layout-component | 394.90 kB |
default-node_modules_pnpm_angular_cdk_20_0_0__angula_0c6041981095ef1687a5543a652ab72a_node_mo-b8206d.js | interface-layouts-main-layout-main-layout-component | 328.25 kB |
default-node_modules_pnpm_rxjs_7_8_2_node_modules_rxjs_dist_esm_internal_observable_merge_js--506572.js | interface-layouts-main-layout-main-layout-component | 303.86 kB |
default-node_modules_pnpm_angular_material_20_0_0_4d60fd831df960055aa25927ecab88e9_node_modul-35d125.js | interface-pages-projects-projects-page              | 279.42 kB |
default-node_modules_pnpm_angular_material_20_0_0_4d60fd831df960055aa25927ecab88e9_node_modul-d34e52.js | interface-layouts-main-layout-main-layout-component | 209.69 kB |
default-src_app_application_services_project_service_ts-node_modules_pnpm_angular_material_20-e31748.js | interface-pages-dashboard-dashboard-page            |  64.05 kB |
src_app_interface_pages_contracts_contracts_page_ts.js                                                  | interface-pages-contracts-contracts-page            |  36.31 kB |
src_app_interface_pages_dashboard_dashboard_page_ts.js                                                  | interface-pages-dashboard-dashboard-page            |  35.86 kB |
default-node_modules_pnpm_angular_material_20_0_0_4d60fd831df960055aa25927ecab88e9_node_modul-87b898.js | interface-pages-dashboard-dashboard-page            |  33.69 kB |

Build at: 2025-08-18T20:25:37.617Z - Hash: ac80459a97d80f36 - Time: 42065ms

Error: src/app/infrastructure/persistence/mock-contract.repository.ts:34:58 - error TS2353: Object literal may only specify known properties, and 'dueDate' does not exist in type 'Payment'.

34         { id: 'PAY-001', amount: 125000, status: 'Paid', dueDate: new Date('2023-02-15'), paidDate: new Date('2023-03-01') },
                                                            ~~~~~~~


Error: src/app/infrastructure/persistence/mock-contract.repository.ts:35:58 - error TS2353: Object literal may only specify known properties, and 'dueDate' does not exist in type 'Payment'.

35         { id: 'PAY-002', amount: 250000, status: 'Paid', dueDate: new Date('2023-05-20'), paidDate: new Date('2023-06-05') },
                                                            ~~~~~~~


Error: src/app/infrastructure/persistence/mock-contract.repository.ts:36:61 - error TS2353: Object literal may only specify known properties, and 'dueDate' does not exist in type 'Payment'.

36         { id: 'PAY-003', amount: 250000, status: 'Pending', dueDate: new Date('2023-08-18') },
                                                               ~~~~~~~


Error: src/app/infrastructure/persistence/mock-contract.repository.ts:58:57 - error TS2353: Object literal may only specify known properties, and 'dueDate' does not exist in type 'Payment'.

58         { id: 'PAY-004', amount: 78000, status: 'Paid', dueDate: new Date('2023-03-30'), paidDate: new Date('2023-04-15') },
                                                           ~~~~~~~


Error: src/app/infrastructure/persistence/mock-contract.repository.ts:59:61 - error TS2353: Object literal may only specify known properties, and 'dueDate' does not exist in type 'Payment'.

59         { id: 'PAY-005', amount: 156000, status: 'Pending', dueDate: new Date('2023-06-25') },
                                                               ~~~~~~~


Error: src/app/infrastructure/persistence/mock-contract.repository.ts:78:58 - error TS2353: Object literal may only specify known properties, and 'dueDate' does not exist in type 'Payment'.

78         { id: 'PAY-006', amount: 225000, status: 'Paid', dueDate: new Date('2024-03-15'), paidDate: new Date('2024-04-01') },
                                                            ~~~~~~~


Error: src/app/infrastructure/persistence/mock-contract.repository.ts:79:58 - error TS2353: Object literal may only specify known properties, and 'dueDate' does not exist in type 'Payment'.

79         { id: 'PAY-007', amount: 225000, status: 'Paid', dueDate: new Date('2024-07-05'), paidDate: new Date('2024-07-20') },
                                                            ~~~~~~~


Error: src/app/interface/components/create-project-dialog/create-project-dialog.component.ts:31:5 - error NG1010: 'imports' must be an array of components, directives, pipes, or NgModules.
  Value could not be determined statically.

31     MatFormFieldModule,
       ~~~~~~~~~~~~~~~~~~

  src/app/interface/components/create-project-dialog/create-project-dialog.component.ts:31:5
    31     MatFormFieldModule,
           ~~~~~~~~~~~~~~~~~~
    Unknown reference.


Error: src/app/interface/components/create-project-dialog/create-project-dialog.component.ts:31:5 - error TS2304: Cannot find name 'MatFormFieldModule'.

31     MatFormFieldModule,
       ~~~~~~~~~~~~~~~~~~


Error: src/app/interface/components/project-progress-chart/project-progress-chart.component.ts:17:1 - error TS1435: Unknown keyword or identifier. Did you mean 'import'?

17 impor{ Project, Task } from '@shared/types';
   ~~~~~


Error: src/app/interface/components/project-progress-chart/project-progress-chart.component.ts:17:1 - error TS2304: Cannot find name 'impor'.

17 impor{ Project, Task } from '@shared/types';
   ~~~~~


Error: src/app/interface/components/project-progress-chart/project-progress-chart.component.ts:17:8 - error TS2304: Cannot find name 'Project'.

17 impor{ Project, Task } from '@shared/types';
          ~~~~~~~


Error: src/app/interface/components/project-progress-chart/project-progress-chart.component.ts:17:8 - error TS2695: Left side of comma operator is unused and has no side effects.

17 impor{ Project, Task } from '@shared/types';
          ~~~~~~~


Error: src/app/interface/components/project-progress-chart/project-progress-chart.component.ts:17:17 - error TS2304: Cannot find name 'Task'.

17 impor{ Project, Task } from '@shared/types';
                   ~~~~


Error: src/app/interface/components/project-progress-chart/project-progress-chart.component.ts:17:24 - error TS1434: Unexpected keyword or identifier.

17 impor{ Project, Task } from '@shared/types';
                          ~~~~


Error: src/app/interface/components/project-progress-chart/project-progress-chart.component.ts:17:24 - error TS2304: Cannot find name 'from'.

17 impor{ Project, Task } from '@shared/types';
                          ~~~~


Error: src/app/interface/components/project-progress-chart/project-progress-chart.component.ts:198:37 - error TS2304: Cannot find name 'Project'.

198   readonly project = input.required<Project>();
                                        ~~~~~~~


Error: src/app/interface/components/project-progress-chart/project-progress-chart.component.ts:228:31 - error TS2304: Cannot find name 'Task'.

228   private getLeafTasks(tasks: Task[]): Task[] {
                                  ~~~~


Error: src/app/interface/components/project-progress-chart/project-progress-chart.component.ts:228:40 - error TS2304: Cannot find name 'Task'.

228   private getLeafTasks(tasks: Task[]): Task[] {
                                           ~~~~


Error: src/app/interface/components/project-progress-chart/project-progress-chart.component.ts:229:22 - error TS2304: Cannot find name 'Task'.

229     const leafTasks: Task[] = [];
                         ~~~~


Error: src/app/interface/pages/contracts/contracts.page.ts:30:5 - error NG1010: 'imports' must be an array of components, directives, pipes, or NgModules.
  Value could not be determined statically.

30     ContractsTableComponent
       ~~~~~~~~~~~~~~~~~~~~~~~

  src/app/interface/pages/contracts/contracts.page.ts:30:5
    30     ContractsTableComponent
           ~~~~~~~~~~~~~~~~~~~~~~~
    Unknown reference.


Error: src/app/interface/pages/contracts/contracts.page.ts:30:5 - error TS2304: Cannot find name 'ContractsTableComponent'.

30     ContractsTableComponent
       ~~~~~~~~~~~~~~~~~~~~~~~


Error: src/app/interface/pages/dashboard/dashboard.page.ts:18:1 - error TS2304: Cannot find name 'importButtonModule'.

18 importButtonModule } from '@angular/material/button';
   ~~~~~~~~~~~~~~~~~~


Error: src/app/interface/pages/dashboard/dashboard.page.ts:18:20 - error TS1128: Declaration or statement expected.

18 importButtonModule } from '@angular/material/button';
                      ~


Error: src/app/interface/pages/dashboard/dashboard.page.ts:18:22 - error TS1434: Unexpected keyword or identifier.

18 importButtonModule } from '@angular/material/button';
                        ~~~~


Error: src/app/interface/pages/dashboard/dashboard.page.ts:18:22 - error TS2304: Cannot find name 'from'.

18 importButtonModule } from '@angular/material/button';
                        ~~~~


Error: src/app/interface/pages/dashboard/dashboard.page.ts:30:5 - error NG1010: 'imports' must be an array of components, directives, pipes, or NgModules.
  Value could not be determined statically.

30     MatButtonModule,
       ~~~~~~~~~~~~~~~

  src/app/interface/pages/dashboard/dashboard.page.ts:30:5
    30     MatButtonModule,
           ~~~~~~~~~~~~~~~
    Unknown reference.


Error: src/app/interface/pages/dashboard/dashboard.page.ts:30:5 - error TS2304: Cannot find name 'MatButtonModule'.

30     MatButtonModule,
       ~~~~~~~~~~~~~~~


Error: src/main.ts:31:7 - error TS2322: Type 'EnvironmentProviders' is not assignable to type 'ImportProvidersSource'.

31       provideFirebaseApp(() => initializeApp(environment.firebase)),
         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


Error: src/main.ts:32:7 - error TS2322: Type 'EnvironmentProviders' is not assignable to type 'ImportProvidersSource'.

32       provideFirestore(() => getFirestore())
         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~




** Angular Live Development Server is listening on localhost:4200, open your browser on http://localhost:4200/ **


× Failed to compile.
✔ Browser application bundle generation complete.



15 unchanged chunks

Build at: 2025-08-18T20:25:41.151Z - Hash: ac80459a97d80f36 - Time: 3343ms

Error: src/app/infrastructure/persistence/mock-contract.repository.ts:34:58 - error TS2353: Object literal may only specify known properties, and 'dueDate' does not exist in type 'Payment'.

34         { id: 'PAY-001', amount: 125000, status: 'Paid', dueDate: new Date('2023-02-15'), paidDate: new Date('2023-03-01') },
                                                            ~~~~~~~


Error: src/app/infrastructure/persistence/mock-contract.repository.ts:35:58 - error TS2353: Object literal may only specify known properties, and 'dueDate' does not exist in type 'Payment'.

35         { id: 'PAY-002', amount: 250000, status: 'Paid', dueDate: new Date('2023-05-20'), paidDate: new Date('2023-06-05') },
                                                            ~~~~~~~


Error: src/app/infrastructure/persistence/mock-contract.repository.ts:36:61 - error TS2353: Object literal may only specify known properties, and 'dueDate' does not exist in type 'Payment'.

36         { id: 'PAY-003', amount: 250000, status: 'Pending', dueDate: new Date('2023-08-18') },
                                                               ~~~~~~~


Error: src/app/infrastructure/persistence/mock-contract.repository.ts:58:57 - error TS2353: Object literal may only specify known properties, and 'dueDate' does not exist in type 'Payment'.

58         { id: 'PAY-004', amount: 78000, status: 'Paid', dueDate: new Date('2023-03-30'), paidDate: new Date('2023-04-15') },
                                                           ~~~~~~~


Error: src/app/infrastructure/persistence/mock-contract.repository.ts:59:61 - error TS2353: Object literal may only specify known properties, and 'dueDate' does not exist in type 'Payment'.

59         { id: 'PAY-005', amount: 156000, status: 'Pending', dueDate: new Date('2023-06-25') },
                                                               ~~~~~~~


Error: src/app/infrastructure/persistence/mock-contract.repository.ts:78:58 - error TS2353: Object literal may only specify known properties, and 'dueDate' does not exist in type 'Payment'.

78         { id: 'PAY-006', amount: 225000, status: 'Paid', dueDate: new Date('2024-03-15'), paidDate: new Date('2024-04-01') },
                                                            ~~~~~~~


Error: src/app/infrastructure/persistence/mock-contract.repository.ts:79:58 - error TS2353: Object literal may only specify known properties, and 'dueDate' does not exist in type 'Payment'.

79         { id: 'PAY-007', amount: 225000, status: 'Paid', dueDate: new Date('2024-07-05'), paidDate: new Date('2024-07-20') },
                                                            ~~~~~~~


Error: src/app/interface/components/create-project-dialog/create-project-dialog.component.ts:31:5 - error NG1010: 'imports' must be an array of components, directives, pipes, or NgModules.
  Value could not be determined statically.

31     MatFormFieldModule,
       ~~~~~~~~~~~~~~~~~~

  src/app/interface/components/create-project-dialog/create-project-dialog.component.ts:31:5
    31     MatFormFieldModule,
           ~~~~~~~~~~~~~~~~~~
    Unknown reference.


Error: src/app/interface/components/create-project-dialog/create-project-dialog.component.ts:31:5 - error TS2304: Cannot find name 'MatFormFieldModule'.

31     MatFormFieldModule,
       ~~~~~~~~~~~~~~~~~~


Error: src/app/interface/components/project-progress-chart/project-progress-chart.component.ts:17:1 - error TS1435: Unknown keyword or identifier. Did you mean 'import'?

17 impor{ Project, Task } from '@shared/types';
   ~~~~~


Error: src/app/interface/components/project-progress-chart/project-progress-chart.component.ts:17:1 - error TS2304: Cannot find name 'impor'.

17 impor{ Project, Task } from '@shared/types';
   ~~~~~


Error: src/app/interface/components/project-progress-chart/project-progress-chart.component.ts:17:8 - error TS2304: Cannot find name 'Project'.

17 impor{ Project, Task } from '@shared/types';
          ~~~~~~~


Error: src/app/interface/components/project-progress-chart/project-progress-chart.component.ts:17:8 - error TS2695: Left side of comma operator is unused and has no side effects.

17 impor{ Project, Task } from '@shared/types';
          ~~~~~~~


Error: src/app/interface/components/project-progress-chart/project-progress-chart.component.ts:17:17 - error TS2304: Cannot find name 'Task'.

17 impor{ Project, Task } from '@shared/types';
                   ~~~~


Error: src/app/interface/components/project-progress-chart/project-progress-chart.component.ts:17:24 - error TS1434: Unexpected keyword or identifier.

17 impor{ Project, Task } from '@shared/types';
                          ~~~~


Error: src/app/interface/components/project-progress-chart/project-progress-chart.component.ts:17:24 - error TS2304: Cannot find name 'from'.

17 impor{ Project, Task } from '@shared/types';
                          ~~~~


Error: src/app/interface/components/project-progress-chart/project-progress-chart.component.ts:198:37 - error TS2304: Cannot find name 'Project'.

198   readonly project = input.required<Project>();
                                        ~~~~~~~


Error: src/app/interface/components/project-progress-chart/project-progress-chart.component.ts:228:31 - error TS2304: Cannot find name 'Task'.

228   private getLeafTasks(tasks: Task[]): Task[] {
                                  ~~~~


Error: src/app/interface/components/project-progress-chart/project-progress-chart.component.ts:228:40 - error TS2304: Cannot find name 'Task'.

228   private getLeafTasks(tasks: Task[]): Task[] {
                                           ~~~~


Error: src/app/interface/components/project-progress-chart/project-progress-chart.component.ts:229:22 - error TS2304: Cannot find name 'Task'.

229     const leafTasks: Task[] = [];
                         ~~~~


Error: src/app/interface/pages/contracts/contracts.page.ts:30:5 - error NG1010: 'imports' must be an array of components, directives, pipes, or NgModules.
  Value could not be determined statically.

30     ContractsTableComponent
       ~~~~~~~~~~~~~~~~~~~~~~~

  src/app/interface/pages/contracts/contracts.page.ts:30:5
    30     ContractsTableComponent
           ~~~~~~~~~~~~~~~~~~~~~~~
    Unknown reference.


Error: src/app/interface/pages/contracts/contracts.page.ts:30:5 - error TS2304: Cannot find name 'ContractsTableComponent'.

30     ContractsTableComponent
       ~~~~~~~~~~~~~~~~~~~~~~~


Error: src/app/interface/pages/dashboard/dashboard.page.ts:18:1 - error TS2304: Cannot find name 'importButtonModule'.

18 importButtonModule } from '@angular/material/button';
   ~~~~~~~~~~~~~~~~~~


Error: src/app/interface/pages/dashboard/dashboard.page.ts:18:20 - error TS1128: Declaration or statement expected.

18 importButtonModule } from '@angular/material/button';
                      ~


Error: src/app/interface/pages/dashboard/dashboard.page.ts:18:22 - error TS1434: Unexpected keyword or identifier.

18 importButtonModule } from '@angular/material/button';
                        ~~~~


Error: src/app/interface/pages/dashboard/dashboard.page.ts:18:22 - error TS2304: Cannot find name 'from'.

18 importButtonModule } from '@angular/material/button';
                        ~~~~


Error: src/app/interface/pages/dashboard/dashboard.page.ts:30:5 - error NG1010: 'imports' must be an array of components, directives, pipes, or NgModules.
  Value could not be determined statically.

30     MatButtonModule,
       ~~~~~~~~~~~~~~~

  src/app/interface/pages/dashboard/dashboard.page.ts:30:5
    30     MatButtonModule,
           ~~~~~~~~~~~~~~~
    Unknown reference.


Error: src/app/interface/pages/dashboard/dashboard.page.ts:30:5 - error TS2304: Cannot find name 'MatButtonModule'.

30     MatButtonModule,
       ~~~~~~~~~~~~~~~


Error: src/main.ts:31:7 - error TS2322: Type 'EnvironmentProviders' is not assignable to type 'ImportProvidersSource'.

31       provideFirebaseApp(() => initializeApp(environment.firebase)),
         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


Error: src/main.ts:32:7 - error TS2322: Type 'EnvironmentProviders' is not assignable to type 'ImportProvidersSource'.

32       provideFirestore(() => getFirestore())
         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~




× Failed to compile.
