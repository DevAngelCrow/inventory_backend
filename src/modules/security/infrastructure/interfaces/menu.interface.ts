export interface Menu {
  active: boolean;
  description: string;
  icon: string;
  name: string;
  order: number;
  parent: Menu | null;
  required_auth: boolean;
  show: boolean;
  title: string;
  uri: string;
  children: Child[];
  id: string;
}

export interface Child {
  active: boolean;
  description: string;
  icon: string;
  name: string;
  order: number;
  id_parent: string | null;
  required_auth: boolean;
  show: boolean;
  title: string;
  uri: string;
  children: Child[];
  id: string;
}
