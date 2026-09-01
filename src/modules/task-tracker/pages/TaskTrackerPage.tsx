import React from 'react';
import { CheckSquare, Plus, Clock, User as UserIcon, AlertCircle } from 'lucide-react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Card } from '../../../components/layout/Card';
import { Button } from '../../../components/ui/Button';
import { Table, Column } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Alert } from '../../../components/feedback/Alert';
import { useProject } from '../../../app/providers/ProjectProvider';
import { useToast } from '../../../app/providers/ToastProvider';
import { mockTasks } from '../../../mock';
import { Task } from '../../../types';

// =========================================================================
// MODULE 4 (or 6): QA Task Allocation & Sprint Board
// Owner: TBD (Team Member F)
// Description: Intelligent sprint load balancing, task assignment,
// and execution burndown analytics for QA engineering teams.
// =========================================================================

export const TaskTrackerPage: React.FC = () => {
  const { activeProject } = useProject();
  const { showToast } = useToast();

  const columns: Column<Task>[] = [
    {
      key: 'title',
      header: 'Task Title & Description',
      render: (task: Task) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{task.title}</div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: '2px' }}>
            {task.description}
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      width: '140px',
      render: (task: Task) => <span className="badge badge-default">{task.type}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      width: '120px',
      render: (task: Task) => {
        const variant = task.status === 'Completed' ? 'passed' : task.status === 'In Progress' ? 'info' : 'default';
        return <Badge variant={variant}>{task.status}</Badge>;
      },
    },
    {
      key: 'priority',
      header: 'Priority',
      width: '100px',
      render: (task: Task) => {
        const variant = task.priority === 'Critical' ? 'failed' : task.priority === 'High' ? 'warning' : 'default';
        return <Badge variant={variant}>{task.priority}</Badge>;
      },
    },
    {
      key: 'assignee',
      header: 'Assignee',
      width: '140px',
      render: (task: Task) => (
        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--text-primary)' }}>
          {task.assignee?.name || 'Unassigned'}
        </span>
      ),
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      width: '110px',
      render: (task: Task) => (
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
          {task.dueDate}
        </span>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="QA Task Allocation & Tracking"
        description={`Sprint QA workload allocation, task delegation, and execution progress for ${activeProject.name}.`}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Task Tracker' }]}
        badge={<span className="badge badge-default">{mockTasks.length} Tasks</span>}
        actions={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus size={14} />}
            onClick={() => showToast('Create Task', 'Opening new QA task modal', 'info')}
          >
            Create Task
          </Button>
        }
      />

      <div style={{ marginBottom: '1.25rem' }}>
        <Alert variant="info" title="Module Boundary: QA Task Allocation">
          // MODULE 4: QA Task Allocation implementation goes here.
          <br />
          Owner: TBD. Modular files live inside <code>src/modules/task-tracker/</code>.
        </Alert>
      </div>

      <Table<Task>
        columns={columns}
        data={mockTasks}
        keyExtractor={(task: Task) => task.id}
      />
    </div>
  );
};
