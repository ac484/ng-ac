/**
 * 評論管理服務
 * 
 * 管理文章評論的 CRUD 操作
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseFirestoreService, BaseEntity, QueryOptions } from './base-firestore.service';

export interface Comment extends BaseEntity {
  // 關聯資訊
  articleId: string;
  articleTitle: string;
  
  // 評論者資訊
  authorId?: string; // 如果是註冊用戶
  authorName: string;
  authorEmail: string;
  authorAvatar?: string;
  authorWebsite?: string;
  
  // 評論內容
  content: string;
  
  // 回覆結構
  parentId?: string; // 父評論 ID
  level: number; // 評論層級 (0 為根評論)
  replyToUserId?: string;
  replyToUserName?: string;
  
  // 狀態管理
  status: 'pending' | 'approved' | 'rejected' | 'spam';
  
  // 統計資料
  likeCount: number;
  dislikeCount: number;
  replyCount: number;
  
  // 審核資訊
  moderatedBy?: string;
  moderatedAt?: Date;
  moderationNote?: string;
  
  // IP 和用戶代理（用於反垃圾郵件）
  ipAddress?: string;
  userAgent?: string;
  
  // 其他標記
  isSticky?: boolean; // 置頂評論
  isHighlighted?: boolean; // 高亮評論
}

@Injectable({
  providedIn: 'root'
})
export class CommentService extends BaseFirestoreService<Comment> {
  protected collectionName = 'comments';

  /**
   * 根據文章 ID 獲取評論
   */
  getByArticleId(articleId: string, options?: QueryOptions): Observable<Comment[]> {
    const queryOptions: QueryOptions = {
      ...options,
      where: [
        ...(options?.where || []),
        { field: 'articleId', operator: '==', value: articleId },
        { field: 'status', operator: '==', value: 'approved' }
      ],
      orderBy: [
        { field: 'isSticky', direction: 'desc' },
        { field: 'createdAt', direction: 'asc' },
        ...(options?.orderBy || [])
      ]
    };

    return this.getAll(queryOptions);
  }

  /**
   * 獲取文章的評論樹狀結構
   */
  getCommentTree(articleId: string): Observable<Comment[]> {
    return this.getByArticleId(articleId).pipe(
      map(comments => this.buildCommentTree(comments))
    );
  }

  /**
   * 建構評論樹狀結構
   */
  private buildCommentTree(comments: Comment[]): Comment[] {
    const commentMap = new Map<string, Comment & { replies?: Comment[] }>();
    const rootComments: (Comment & { replies?: Comment[] })[] = [];

    // 建立 Map 以便快速查找
    comments.forEach(comment => {
      commentMap.set(comment.id!, { ...comment, replies: [] });
    });

    // 建構樹狀結構
    comments.forEach(comment => {
      const commentWithReplies = commentMap.get(comment.id!)!;
      
      if (comment.parentId && commentMap.has(comment.parentId)) {
        const parent = commentMap.get(comment.parentId)!;
        parent.replies!.push(commentWithReplies);
      } else {
        rootComments.push(commentWithReplies);
      }
    });

    return rootComments;
  }

  /**
   * 根據用戶 ID 獲取評論
   */
  getByUserId(userId: string, options?: QueryOptions): Observable<Comment[]> {
    const queryOptions: QueryOptions = {
      ...options,
      where: [
        ...(options?.where || []),
        { field: 'authorId', operator: '==', value: userId }
      ],
      orderBy: [
        { field: 'createdAt', direction: 'desc' },
        ...(options?.orderBy || [])
      ]
    };

    return this.getAll(queryOptions);
  }

  /**
   * 獲取待審核的評論
   */
  getPendingComments(options?: QueryOptions): Observable<Comment[]> {
    const queryOptions: QueryOptions = {
      ...options,
      where: [
        ...(options?.where || []),
        { field: 'status', operator: '==', value: 'pending' }
      ],
      orderBy: [
        { field: 'createdAt', direction: 'asc' },
        ...(options?.orderBy || [])
      ]
    };

    return this.getAll(queryOptions);
  }

  /**
   * 根據狀態獲取評論
   */
  getByStatus(status: Comment['status'], options?: QueryOptions): Observable<Comment[]> {
    const queryOptions: QueryOptions = {
      ...options,
      where: [
        ...(options?.where || []),
        { field: 'status', operator: '==', value: status }
      ],
      orderBy: [
        { field: 'createdAt', direction: 'desc' },
        ...(options?.orderBy || [])
      ]
    };

    return this.getAll(queryOptions);
  }

  /**
   * 創建評論
   */
  createComment(data: Omit<Comment, 'id' | 'createdAt' | 'updatedAt' | 'level' | 'replyCount'>): Observable<string> {
    return new Observable(observer => {
      if (data.parentId) {
        // 如果是回覆評論，先獲取父評論資訊
        this.getById(data.parentId).subscribe(parent => {
          if (parent) {
            const commentData = {
              ...data,
              level: parent.level + 1,
              replyCount: 0
            };
            
            this.create(commentData).subscribe(
              id => {
                // 增加父評論的回覆數量
                this.incrementReplyCount(data.parentId!).subscribe();
                observer.next(id);
              },
              error => observer.error(error)
            );
          } else {
            observer.error(new Error('Parent comment not found'));
          }
        });
      } else {
        // 根評論
        const commentData = {
          ...data,
          level: 0,
          replyCount: 0
        };
        
        this.create(commentData).subscribe(
          id => observer.next(id),
          error => observer.error(error)
        );
      }
    });
  }

  /**
   * 審核評論
   */
  moderateComment(
    commentId: string, 
    status: Comment['status'], 
    moderatorId: string, 
    note?: string
  ): Observable<void> {
    return this.update(commentId, {
      status,
      moderatedBy: moderatorId,
      moderatedAt: new Date(),
      moderationNote: note
    } as any);
  }

  /**
   * 批准評論
   */
  approveComment(commentId: string, moderatorId: string): Observable<void> {
    return this.moderateComment(commentId, 'approved', moderatorId);
  }

  /**
   * 拒絕評論
   */
  rejectComment(commentId: string, moderatorId: string, reason?: string): Observable<void> {
    return this.moderateComment(commentId, 'rejected', moderatorId, reason);
  }

  /**
   * 標記為垃圾郵件
   */
  markAsSpam(commentId: string, moderatorId: string): Observable<void> {
    return this.moderateComment(commentId, 'spam', moderatorId);
  }

  /**
   * 增加點讚數量
   */
  incrementLikeCount(commentId: string): Observable<void> {
    return this.getById(commentId).pipe(
      map(comment => {
        if (comment) {
          return this.update(commentId, {
            likeCount: (comment.likeCount || 0) + 1
          } as any);
        }
        throw new Error('Comment not found');
      })
    ) as any;
  }

  /**
   * 增加不喜歡數量
   */
  incrementDislikeCount(commentId: string): Observable<void> {
    return this.getById(commentId).pipe(
      map(comment => {
        if (comment) {
          return this.update(commentId, {
            dislikeCount: (comment.dislikeCount || 0) + 1
          } as any);
        }
        throw new Error('Comment not found');
      })
    ) as any;
  }

  /**
   * 增加回覆數量
   */
  private incrementReplyCount(commentId: string): Observable<void> {
    return this.getById(commentId).pipe(
      map(comment => {
        if (comment) {
          return this.update(commentId, {
            replyCount: (comment.replyCount || 0) + 1
          } as any);
        }
        throw new Error('Comment not found');
      })
    ) as any;
  }

  /**
   * 設定置頂狀態
   */
  setSticky(commentId: string, isSticky: boolean): Observable<void> {
    return this.update(commentId, {
      isSticky
    } as any);
  }

  /**
   * 設定高亮狀態
   */
  setHighlighted(commentId: string, isHighlighted: boolean): Observable<void> {
    return this.update(commentId, {
      isHighlighted
    } as any);
  }

  /**
   * 獲取最新評論
   */
  getLatestComments(limit: number = 10): Observable<Comment[]> {
    return this.getAll({
      where: [
        { field: 'status', operator: '==', value: 'approved' }
      ],
      orderBy: [
        { field: 'createdAt', direction: 'desc' }
      ],
      limit
    });
  }

  /**
   * 獲取熱門評論（根據點讚數）
   */
  getPopularComments(limit: number = 10): Observable<Comment[]> {
    return this.getAll({
      where: [
        { field: 'status', operator: '==', value: 'approved' }
      ],
      orderBy: [
        { field: 'likeCount', direction: 'desc' }
      ],
      limit
    });
  }

  /**
   * 搜尋評論
   */
  searchComments(searchTerm: string, options?: QueryOptions): Observable<Comment[]> {
    const queryOptions: QueryOptions = {
      ...options,
      where: [
        ...(options?.where || []),
        { field: 'content', operator: '>=', value: searchTerm },
        { field: 'content', operator: '<=', value: searchTerm + '\uf8ff' },
        { field: 'status', operator: '==', value: 'approved' }
      ]
    };

    return this.getAll(queryOptions);
  }

  /**
   * 獲取評論統計
   */
  getCommentStats(): Observable<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    spam: number;
  }> {
    // 這裡需要多個查詢來獲取統計資料
    // 在實際應用中，建議使用 Cloud Functions 來計算統計資料
    return new Observable(observer => {
      Promise.all([
        this.getAll().toPromise(),
        this.getByStatus('pending').toPromise(),
        this.getByStatus('approved').toPromise(),
        this.getByStatus('rejected').toPromise(),
        this.getByStatus('spam').toPromise()
      ]).then(([total, pending, approved, rejected, spam]) => {
        observer.next({
          total: total?.length || 0,
          pending: pending?.length || 0,
          approved: approved?.length || 0,
          rejected: rejected?.length || 0,
          spam: spam?.length || 0
        });
        observer.complete();
      }).catch(error => {
        observer.error(error);
      });
    });
  }
}