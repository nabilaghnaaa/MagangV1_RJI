RJI_Persuratan/
│
├── README.md
├── .gitignore
├── .env.example
│
├── docs/
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── API.md
│   └── QR-VERIFICATION.md
│
│
├── frontend/
│   │
│   ├── public/
│   │   ├── favicon.ico
│   │   └── logo-rji.png
│   │
│   ├── src/
│   │   │
│   │   ├── assets/
│   │   │   ├── images/
│   │   │   └── icons/
│   │   │
│   │   │
│   │   ├── components/
│   │   │   │
│   │   │   ├── common/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Select.jsx
│   │   │   │   ├── Textarea.jsx
│   │   │   │   ├── Checkbox.jsx
│   │   │   │   ├── Radio.jsx
│   │   │   │   ├── Switch.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── ConfirmDialog.jsx
│   │   │   │   ├── Dropdown.jsx
│   │   │   │   ├── Badge.jsx
│   │   │   │   ├── Avatar.jsx
│   │   │   │   ├── Spinner.jsx
│   │   │   │   ├── EmptyState.jsx
│   │   │   │   ├── ErrorState.jsx
│   │   │   │   ├── LoadingScreen.jsx
│   │   │   │   ├── Tooltip.jsx
│   │   │   │   └── Card.jsx
│   │   │   │
│   │   │   │
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── SidebarItem.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── PageHeader.jsx
│   │   │   │   ├── PageContainer.jsx
│   │   │   │   ├── Breadcrumb.jsx
│   │   │   │   └── DashboardLayout.jsx
│   │   │   │
│   │   │   │
│   │   │   ├── table/
│   │   │   │   ├── DataTable.jsx
│   │   │   │   ├── TableHeader.jsx
│   │   │   │   ├── TablePagination.jsx
│   │   │   │   ├── TableSearch.jsx
│   │   │   │   ├── TableFilter.jsx
│   │   │   │   └── TableEmpty.jsx
│   │   │   │
│   │   │   │
│   │   │   ├── form/
│   │   │   │   ├── FormField.jsx
│   │   │   │   ├── FormSection.jsx
│   │   │   │   ├── FormActions.jsx
│   │   │   │   ├── FileUpload.jsx
│   │   │   │   ├── ImageUpload.jsx
│   │   │   │   ├── DatePicker.jsx
│   │   │   │   └── RichTextEditor.jsx
│   │   │   │
│   │   │   │
│   │   │   ├── modal/
│   │   │   │   ├── SuratDetailModal.jsx
│   │   │   │   ├── SuratPreviewModal.jsx
│   │   │   │   ├── UserFormModal.jsx
│   │   │   │   └── ConfirmDeleteModal.jsx
│   │   │   │
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   ├── StatCard.jsx
│   │   │   │   ├── RecentSurat.jsx
│   │   │   │   ├── SuratChart.jsx
│   │   │   │   └── ActivityList.jsx
│   │   │   │
│   │   │   │
│   │   │   └── surat/
│   │   │       ├── SuratForm.jsx
│   │   │       ├── SuratTable.jsx
│   │   │       ├── SuratStatusBadge.jsx
│   │   │       ├── SuratTimeline.jsx
│   │   │       ├── SuratPreview.jsx
│   │   │       ├── SuratMetadata.jsx
│   │   │       ├── SuratActionMenu.jsx
│   │   │       ├── SuratFilter.jsx
│   │   │       ├── SuratNumber.jsx
│   │   │       ├── QRCodePreview.jsx
│   │   │       └── VerificationStatus.jsx
│   │   │
│   │   │
│   │   ├── layouts/
│   │   │   ├── AuthLayout.jsx
│   │   │   ├── DashboardLayout.jsx
│   │   │   └── PublicLayout.jsx
│   │   │
│   │   │
│   │   ├── pages/
│   │   │   │
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── ForgotPassword.jsx
│   │   │   │   └── ResetPassword.jsx
│   │   │   │
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   └── Dashboard.jsx
│   │   │   │
│   │   │   │
│   │   │   ├── surat/
│   │   │   │   ├── SuratMasuk.jsx
│   │   │   │   ├── SuratKeluar.jsx
│   │   │   │   ├── BuatSurat.jsx
│   │   │   │   ├── DetailSurat.jsx
│   │   │   │   ├── EditSurat.jsx
│   │   │   │   ├── RiwayatSurat.jsx
│   │   │   │   └── ArsipSurat.jsx
│   │   │   │
│   │   │   │
│   │   │   ├── templates/
│   │   │   │   ├── TemplateList.jsx
│   │   │   │   ├── TemplateCreate.jsx
│   │   │   │   ├── TemplateEdit.jsx
│   │   │   │   └── TemplateDetail.jsx
│   │   │   │
│   │   │   │
│   │   │   ├── users/
│   │   │   │   ├── UserList.jsx
│   │   │   │   ├── UserCreate.jsx
│   │   │   │   ├── UserEdit.jsx
│   │   │   │   └── UserDetail.jsx
│   │   │   │
│   │   │   │
│   │   │   ├── roles/
│   │   │   │   ├── RoleList.jsx
│   │   │   │   ├── RoleCreate.jsx
│   │   │   │   └── RoleEdit.jsx
│   │   │   │
│   │   │   │
│   │   │   ├── settings/
│   │   │   │   ├── Profile.jsx
│   │   │   │   ├── Organization.jsx
│   │   │   │   └── SystemSettings.jsx
│   │   │   │
│   │   │   │
│   │   │   ├── audit/
│   │   │   │   └── AuditLog.jsx
│   │   │   │
│   │   │   │
│   │   │   └── verification/
│   │   │       ├── VerifySurat.jsx
│   │   │       └── VerificationNotFound.jsx
│   │   │
│   │   │
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── userService.js
│   │   │   ├── roleService.js
│   │   │   ├── suratService.js
│   │   │   ├── templateService.js
│   │   │   ├── attachmentService.js
│   │   │   ├── verificationService.js
│   │   │   └── auditService.js
│   │   │
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useFetch.js
│   │   │   ├── useModal.js
│   │   │   ├── usePagination.js
│   │   │   ├── useDebounce.js
│   │   │   ├── usePermission.js
│   │   │   └── useToast.js
│   │   │
│   │   │
│   │   ├── store/
│   │   │   ├── authStore.js
│   │   │   ├── suratStore.js
│   │   │   └── uiStore.js
│   │   │
│   │   │
│   │   ├── routes/
│   │   │   ├── AppRoutes.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── PublicRoute.jsx
│   │   │   └── RoleRoute.jsx
│   │   │
│   │   │
│   │   ├── constants/
│   │   │   ├── routes.js
│   │   │   ├── roles.js
│   │   │   ├── permissions.js
│   │   │   ├── suratStatus.js
│   │   │   └── fileTypes.js
│   │   │
│   │   │
│   │   ├── utils/
│   │   │   ├── formatDate.js
│   │   │   ├── formatNumber.js
│   │   │   ├── formatStatus.js
│   │   │   ├── validation.js
│   │   │   ├── downloadFile.js
│   │   │   └── cn.js
│   │   │
│   │   │
│   │   ├── schemas/
│   │   │   ├── authSchema.js
│   │   │   ├── userSchema.js
│   │   │   ├── suratSchema.js
│   │   │   └── templateSchema.js
│   │   │
│   │   │
│   │   ├── config/
│   │   │   └── environment.js
│   │   │
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
│
├── backend/
│   │
│   ├── src/
│   │   │
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   ├── environment.js
│   │   │   └── cors.js
│   │   │
│   │   │
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Role.js
│   │   │   ├── Permission.js
│   │   │   ├── RolePermission.js
│   │   │   ├── Surat.js
│   │   │   ├── SuratTemplate.js
│   │   │   ├── Verification.js
│   │   │   ├── Attachment.js
│   │   │   └── AuditLog.js
│   │   │
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── roleController.js
│   │   │   ├── suratController.js
│   │   │   ├── templateController.js
│   │   │   ├── verificationController.js
│   │   │   ├── attachmentController.js
│   │   │   └── auditController.js
│   │   │
│   │   │
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   ├── userService.js
│   │   │   ├── roleService.js
│   │   │   ├── suratService.js
│   │   │   ├── templateService.js
│   │   │   ├── verificationService.js
│   │   │   ├── attachmentService.js
│   │   │   ├── pdfService.js
│   │   │   ├── qrCodeService.js
│   │   │   └── auditService.js
│   │   │
│   │   │
│   │   ├── routes/
│   │   │   ├── index.js
│   │   │   ├── authRoutes.js
│   │   │   ├── userRoutes.js
│   │   │   ├── roleRoutes.js
│   │   │   ├── suratRoutes.js
│   │   │   ├── templateRoutes.js
│   │   │   ├── verificationRoutes.js
│   │   │   ├── attachmentRoutes.js
│   │   │   └── auditRoutes.js
│   │   │
│   │   │
│   │   ├── middlewares/
│   │   │   ├── authMiddleware.js
│   │   │   ├── roleMiddleware.js
│   │   │   ├── permissionMiddleware.js
│   │   │   ├── validationMiddleware.js
│   │   │   ├── uploadMiddleware.js
│   │   │   ├── errorMiddleware.js
│   │   │   └── rateLimitMiddleware.js
│   │   │
│   │   │
│   │   ├── validations/
│   │   │   ├── authValidation.js
│   │   │   ├── userValidation.js
│   │   │   ├── roleValidation.js
│   │   │   ├── suratValidation.js
│   │   │   └── templateValidation.js
│   │   │
│   │   │
│   │   ├── utils/
│   │   │   ├── response.js
│   │   │   ├── pagination.js
│   │   │   ├── token.js
│   │   │   ├── date.js
│   │   │   ├── file.js
│   │   │   └── logger.js
│   │   │
│   │   │
│   │   ├── constants/
│   │   │   ├── roles.js
│   │   │   ├── permissions.js
│   │   │   ├── suratStatus.js
│   │   │   └── verificationStatus.js
│   │   │
│   │   │
│   │   ├── database/
│   │   │   ├── migrations/
│   │   │   ├── seeders/
│   │   │   └── index.js
│   │   │
│   │   │
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── storage/
│   │   ├── uploads/
│   │   ├── surat/
│   │   ├── templates/
│   │   ├── qrcodes/
│   │   └── temp/
│   │
│   ├── tests/
│   │   ├── unit/
│   │   │   ├── auth/
│   │   │   ├── surat/
│   │   │   └── verification/
│   │   │
│   │   └── integration/
│   │       ├── auth/
│   │       ├── surat/
│   │       └── verification/
│   │
│   ├── .env
│   ├── .env.example
│   └── package.json
│
└── .gitignore