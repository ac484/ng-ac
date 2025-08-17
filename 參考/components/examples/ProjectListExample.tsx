'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateProject, useDeleteProject, useProjects } from '@/hooks/firebase';
import type { Project } from '@/types';
import { Loader2, Plus, Trash2 } from 'lucide-react';

export function ProjectListExample() {
  const { data: projects, isLoading, error, refetch } = useProjects();
  const createProject = useCreateProject();
  const deleteProject = useDeleteProject();

  const handleCreateProject = async () => {
    const newProject: Omit<Project, 'id'> = {
      name: `New Project ${Date.now()}`,
      description: 'This is a new project created with TanStack Query',
      client: 'Example Client',
      contractor: 'Example Contractor',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      totalValue: 50000,
      status: 'active',
      scope: 'Project scope description',
      payments: [],
      changeOrders: [],
      versions: [],
      tasks: []
    };

    try {
      await createProject.mutateAsync(newProject);
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProject.mutateAsync(id);
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading projects...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">Error: {error.message}</p>
        <Button onClick={() => refetch()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Projects</h2>
        <div className="flex gap-2">
          <Button
            onClick={handleCreateProject}
            disabled={createProject.isPending}
            className="flex items-center gap-2"
          >
            {createProject.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Create Project
          </Button>
          <Button variant="outline" onClick={() => refetch()}>
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects?.map((project) => (
          <Card key={project.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {project.description}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteProject(project.id)}
                  disabled={deleteProject.isPending}
                  className="ml-2 h-8 w-8 p-0"
                >
                  {deleteProject.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Client:</span>
                <span className="text-sm font-medium">{project.client}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status:</span>
                <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                  {project.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Value:</span>
                <span className="text-sm font-medium">
                  ${project.totalValue.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tasks:</span>
                <span className="text-sm font-medium">
                  {project.tasks?.length || 0}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {projects?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No projects found.</p>
          <Button onClick={handleCreateProject} className="mt-4">
            Create your first project
          </Button>
        </div>
      )}
    </div>
  );
}
