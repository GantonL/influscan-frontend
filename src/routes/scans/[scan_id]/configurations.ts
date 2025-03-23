import type { MenuConfiguration } from "$lib/models/menu";
import { Radar } from "@lucide/svelte";

export const actionsMenuConfiguration: MenuConfiguration = {
    groups: [
      {
        items: [
          {
            title: 'Rescan',
            icon: Radar,
            event: 'rescan'
          }
        ]
      }
    ]
};
