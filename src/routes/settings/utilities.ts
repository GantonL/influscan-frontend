import type { ScansSettings } from "$lib/models/settings";

export const updateScansSettings = async (updateObejct: Partial<Omit<ScansSettings, 'user_id'>>): Promise<{success: boolean}> => {
  return new Promise((resolve, reject) => {
    const body = new FormData();
    body.append('updateObject', JSON.stringify(updateObejct));
    fetch('/settings', {method: 'PUT', body})
      .then((res) => {
        res.json()
          .then((res) => {
            resolve(res);
          }, reject);
      }, reject);
  });
}