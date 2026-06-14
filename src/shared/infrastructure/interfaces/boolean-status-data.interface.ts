export interface BooleanStatusData {
  id: string;
  name: string;
  code: string;
  description: string;
  active: boolean;
  state_color: string;
  text_color: string;
  id_category_status: string;
  ctl_category_status: {
    id: string;
    name: string;
    description: string;
    code: string;
    active: boolean | null;
  };
}
