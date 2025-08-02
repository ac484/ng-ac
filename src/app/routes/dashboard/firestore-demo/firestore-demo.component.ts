/**
 * Firestore 服務使用範例
 * 
 * 展示如何使用各種 Firestore 服務進行 CRUD 操作
 */

import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { 
  UserService, 
  ArticleService, 
  CategoryService, 
  CommentService,
  User,
  Article,
  Category,
  Comment
} from '../../../core/services';
import { PageHeaderType, PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTagModule } from 'ng-zorro-antd/tag';

@Component({
  selector: 'app-firestore-demo',
  templateUrl: './firestore-demo.component.html',
  styleUrls: ['./firestore-demo.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    NzCardModule,
    NzTabsModule,
    NzFormModule,
    ReactiveFormsModule,
    FormsModule,
    NzGridModule,
    NzInputModule,
    NzInputNumberModule,
    NzSelectModule,
    NzButtonModule,
    NzSpinModule,
    NzListModule,
    NzTagModule
  ]
})
export class FirestoreDemoComponent implements OnInit {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Firestore 服務範例',
    desc: '展示如何使用 Firestore 服務進行 CRUD 操作',
    breadcrumb: ['首頁', '儀表板', 'Firestore 範例']
  };

  // 表單
  userForm!: FormGroup;
  articleForm!: FormGroup;
  categoryForm!: FormGroup;
  commentForm!: FormGroup;

  // 數據
  users: User[] = [];
  articles: Article[] = [];
  categories: Category[] = [];
  comments: Comment[] = [];

  // 載入狀態
  loading = {
    users: false,
    articles: false,
    categories: false,
    comments: false
  };

  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private message = inject(NzMessageService);
  private userService = inject(UserService);
  private articleService = inject(ArticleService);
  private categoryService = inject(CategoryService);
  private commentService = inject(CommentService);

  ngOnInit(): void {
    this.initForms();
    this.loadAllData();
  }

  private initForms(): void {
    // 用戶表單
    this.userForm = this.fb.group({
      uid: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      displayName: ['', [Validators.required]],
      phoneNumber: [''],
      isActive: [true]
    });

    // 文章表單
    this.articleForm = this.fb.group({
      title: ['', [Validators.required]],
      content: ['', [Validators.required]],
      slug: ['', [Validators.required]],
      authorId: ['', [Validators.required]],
      authorName: ['', [Validators.required]],
      categoryId: [''],
      tags: [''],
      status: ['draft', [Validators.required]]
    });

    // 分類表單
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required]],
      slug: ['', [Validators.required]],
      description: [''],
      parentId: [''],
      isActive: [true],
      sortOrder: [0]
    });

    // 評論表單
    this.commentForm = this.fb.group({
      articleId: ['', [Validators.required]],
      authorName: ['', [Validators.required]],
      authorEmail: ['', [Validators.required, Validators.email]],
      content: ['', [Validators.required]],
      status: ['pending', [Validators.required]]
    });
  }

  private loadAllData(): void {
    this.loadUsers();
    this.loadArticles();
    this.loadCategories();
    this.loadComments();
  }

  // 用戶操作
  loadUsers(): void {
    this.loading.users = true;
    this.userService.getActiveUsers({ limit: 10 }).subscribe({
      next: (users) => {
        this.users = users;
        this.loading.users = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('載入用戶失敗:', error);
        this.message.error('載入用戶失敗');
        this.loading.users = false;
        this.cdr.markForCheck();
      }
    });
  }

  createUser(): void {
    if (this.userForm.valid) {
      const userData = {
        ...this.userForm.value,
        emailVerified: false,
        isAnonymous: false,
        lastLoginAt: new Date(),
        roles: ['user'],
        permissions: []
      };

      this.userService.createWithId(userData.uid, userData).subscribe({
        next: () => {
          this.message.success('用戶創建成功');
          this.userForm.reset();
          this.loadUsers();
        },
        error: (error) => {
          console.error('創建用戶失敗:', error);
          this.message.error('創建用戶失敗');
        }
      });
    }
  }

  // 文章操作
  loadArticles(): void {
    this.loading.articles = true;
    this.articleService.getPublishedArticles({ limit: 10 }).subscribe({
      next: (articles) => {
        this.articles = articles;
        this.loading.articles = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('載入文章失敗:', error);
        this.message.error('載入文章失敗');
        this.loading.articles = false;
        this.cdr.markForCheck();
      }
    });
  }

  createArticle(): void {
    if (this.articleForm.valid) {
      const formValue = this.articleForm.value;
      const articleData = {
        ...formValue,
        excerpt: formValue.content.substring(0, 200),
        tags: formValue.tags ? formValue.tags.split(',').map((tag: string) => tag.trim()) : [],
        viewCount: 0,
        likeCount: 0,
        commentCount: 0,
        shareCount: 0,
        allowComments: true,
        isFeatured: false,
        isSticky: false
      };

      this.articleService.create(articleData).subscribe({
        next: () => {
          this.message.success('文章創建成功');
          this.articleForm.reset();
          this.loadArticles();
        },
        error: (error) => {
          console.error('創建文章失敗:', error);
          this.message.error('創建文章失敗');
        }
      });
    }
  }

  publishArticle(articleId: string): void {
    this.articleService.publishArticle(articleId).subscribe({
      next: () => {
        this.message.success('文章發布成功');
        this.loadArticles();
      },
      error: (error) => {
        console.error('發布文章失敗:', error);
        this.message.error('發布文章失敗');
      }
    });
  }

  // 分類操作
  loadCategories(): void {
    this.loading.categories = true;
    this.categoryService.getVisibleCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loading.categories = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('載入分類失敗:', error);
        this.message.error('載入分類失敗');
        this.loading.categories = false;
        this.cdr.markForCheck();
      }
    });
  }

  createCategory(): void {
    if (this.categoryForm.valid) {
      const categoryData = {
        ...this.categoryForm.value,
        isVisible: true,
        articleCount: 0
      };

      this.categoryService.createCategory(categoryData).subscribe({
        next: () => {
          this.message.success('分類創建成功');
          this.categoryForm.reset();
          this.loadCategories();
        },
        error: (error) => {
          console.error('創建分類失敗:', error);
          this.message.error('創建分類失敗');
        }
      });
    }
  }

  // 評論操作
  loadComments(): void {
    this.loading.comments = true;
    this.commentService.getLatestComments(10).subscribe({
      next: (comments) => {
        this.comments = comments;
        this.loading.comments = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('載入評論失敗:', error);
        this.message.error('載入評論失敗');
        this.loading.comments = false;
        this.cdr.markForCheck();
      }
    });
  }

  createComment(): void {
    if (this.commentForm.valid) {
      const commentData = {
        ...this.commentForm.value,
        articleTitle: '範例文章',
        level: 0,
        likeCount: 0,
        dislikeCount: 0,
        replyCount: 0
      };

      this.commentService.createComment(commentData).subscribe({
        next: () => {
          this.message.success('評論創建成功');
          this.commentForm.reset();
          this.loadComments();
        },
        error: (error) => {
          console.error('創建評論失敗:', error);
          this.message.error('創建評論失敗');
        }
      });
    }
  }

  approveComment(commentId: string): void {
    this.commentService.approveComment(commentId, 'admin').subscribe({
      next: () => {
        this.message.success('評論已批准');
        this.loadComments();
      },
      error: (error) => {
        console.error('批准評論失敗:', error);
        this.message.error('批准評論失敗');
      }
    });
  }

  // 工具方法
  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'draft': 'default',
      'published': 'success',
      'archived': 'warning',
      'pending': 'processing',
      'approved': 'success',
      'rejected': 'error',
      'spam': 'error'
    };
    return colors[status] || 'default';
  }

  formatDate(date: any): string {
    if (!date) return '';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('zh-TW');
  }
}