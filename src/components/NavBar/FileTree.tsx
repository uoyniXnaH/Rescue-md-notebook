import Box from '@mui/material/Box';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

const dummy: TreeViewBaseItem[] = [
  {
    id: 'prj1',
    label: 'Project No.1',
    children: [
      { id: 'prj1-spec', label: 'specifications' },
      { id: 'prj1-meeting', label: 'meeting memo' },
      { id: 'prj1-schedule', label: 'schedules' },
    ],
  },
  {
    id: 'prj2',
    label: 'Project No.2',
    children: [
      {
        id: 'spec',
        label: 'specifications',
        children: [
          { id: 'prj2-spec1', label: 'specification 1' },
          { id: 'prj2-spec2', label: 'specification 2' },
        ],
      },
      { id: 'prj2-schedule', label: 'schedules' },
      {
        id: 'prj2-addition',
        label: 'additions',
        children: [
          { id: 'prj2-addition1', label: 'addition 1' },
        ],
      },
    ],
  },
  {
    id: 'prj3',
    label: 'Project No.3',
    children: [{ id: 'prj3-community', label: 'community' }],
  },
  {
    id: 'prj4',
    label: 'Project No.4',
    children: [
      { id: 'prj4-community', label: 'community' },
      { id: 'prj4-schedule', label: 'schedules' },
    ],
  },
];

export default function FileTree() {
  return (
    <Box overflow="auto">
      <RichTreeView items={dummy} />
    </Box>
  );
}
