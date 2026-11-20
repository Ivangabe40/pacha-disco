import { base44 } from "@/api/base44Client";

/**
 * Sube un archivo a storage público y devuelve su URL.
 *
 * El runtime del SDK expone `UploadPublicFile`, pero los tipos publicados de
 * `CoreIntegrations` todavía declaran solo `UploadFile`. La forma exacta del
 * método se declara acá, en un único lugar, para no repetir conversiones de
 * tipo en cada formulario de administración.
 *
 * @param {File} file
 * @returns {Promise<string>} URL pública del archivo
 */
export async function uploadPublicFile(file) {
  const core = /** @type {{ UploadPublicFile: (params: { file: File }) => Promise<{ file_url: string }> }} */ (
    /** @type {unknown} */ (base44.integrations.Core)
  );
  const { file_url } = await core.UploadPublicFile({ file });
  return file_url;
}