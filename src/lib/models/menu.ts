import type { ButtonVariant } from "$lib/components/ui/button";
import type { IconProps } from "@lucide/svelte";
import type { Component } from "svelte";

export interface MenuActionItem<T = void> {
  title: string;
  event: string;
  icon: Component<IconProps>;
  class?: string;
  disableIf?: (data: T) => boolean;
  variant?: ButtonVariant;
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