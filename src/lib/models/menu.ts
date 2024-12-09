import type { ButtonVariant } from "$lib/components/ui/button";

export interface MenuActionItem<T = void> {
  title: string;
  event: string;
  icon: ConstructorOfATypedSvelteComponent;
  class?: string;
  disableIf?: (data: T) => boolean
}

export interface MenuActionItemGroup<T = void> {
  items: MenuActionItem<T>[];
  header?: string;
}

export interface MenuConfiguration<T = void> {
  groups: MenuActionItemGroup<T>[];
  label?: string;
  buttonVariant?: ButtonVariant;
  trigger?: ConstructorOfATypedSvelteComponent;
  triggerClass?: string;
}