export interface MenuActionItem {
  title: string;
  event: string;
  icon: ConstructorOfATypedSvelteComponent;
  class?: string;
}

export interface MenuActionItemGroup {
  items: MenuActionItem[];
  header?: string;
}

export interface MenuConfiguration {
  groups: MenuActionItemGroup[];
  trigger?: ConstructorOfATypedSvelteComponent;
  triggerClass?: string;
}