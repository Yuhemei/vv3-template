export interface Menus {
  id?: string;
  pid?: string;
  icon?: string;
  index: string;
  redirect?: string;
  title: string;
  permiss?: string;
  children?: Menus[];
}
