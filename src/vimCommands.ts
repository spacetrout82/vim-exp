export type VimMode = 'normal' | 'insert' | 'visual';

export interface VimCommand {
  id: string;
  mode: VimMode;
  keystroke: string;        // exact sequence the player must type
  description: string;
  points: number;
}

export const vimCommands: VimCommand[] = [
  // Normal mode – easy
  { id: 'h', mode: 'normal', keystroke: 'h', description: 'Move cursor left', points: 1 },
  { id: 'j', mode: 'normal', keystroke: 'j', description: 'Move cursor down', points: 1 },
  { id: 'k', mode: 'normal', keystroke: 'k', description: 'Move cursor up', points: 1 },
  { id: 'l', mode: 'normal', keystroke: 'l', description: 'Move cursor right', points: 1 },
  { id: 'i', mode: 'normal', keystroke: 'i', description: 'Enter insert mode before cursor', points: 2 },
  { id: 'a', mode: 'normal', keystroke: 'a', description: 'Enter insert mode after cursor', points: 2 },
  { id: 'o', mode: 'normal', keystroke: 'o', description: 'Open line below & insert', points: 3 },
  { id: 'O', mode: 'normal', keystroke: 'O', description: 'Open line above & insert', points: 3 },
  { id: 'Esc', mode: 'normal', keystroke: 'Esc', description: 'Exit insert/visual mode', points: 1 },

  // Multi-key & counts
  { id: 'dd', mode: 'normal', keystroke: 'dd', description: 'Delete current line', points: 4 },
  { id: 'yy', mode: 'normal', keystroke: 'yy', description: 'Yank (copy) current line', points: 4 },
  { id: 'ciw', mode: 'normal', keystroke: 'ciw', description: 'Change inner word', points: 6 },
  { id: '3j', mode: 'normal', keystroke: '3j', description: 'Move down 3 lines', points: 3 },
  { id: 'gg', mode: 'normal', keystroke: 'gg', description: 'Go to top of file', points: 3 },
  { id: 'G', mode: 'normal', keystroke: 'G', description: 'Go to bottom of file', points: 3 },

  // Insert mode keys (you’ll be in insert when these appear)
  { id: 'C-h', mode: 'insert', keystroke: '<C-h>', description: 'Delete char before cursor (Ctrl+h)', points: 2 },
  { id: 'C-BS', mode: 'insert', keystroke: '<C-BS>', description: 'Delete word before cursor', points: 4 },
  { id: 'C-u', mode: 'insert', keystroke: '<C-u>', description: 'Delete to start of line', points: 5 },

  // More to come later…
];