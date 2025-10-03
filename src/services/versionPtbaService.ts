import { api } from "../lib/api";
import type { VersionPtba } from "../types/entities";
import type { VersionPtbaFormData } from "../schemas/ptbaSchemas";

const versionPtbaService = {
  async getAll(): Promise<VersionPtba[]> {
    const response = await api.get("/version_ptba/");
    return response.data;
  },

  async getById(id: number): Promise<VersionPtba> {
    const response = await api.get(`/version_ptba/${id}/`);
    return response.data;
  },

  async create(data: VersionPtbaFormData, file?: File): Promise<VersionPtba> {
    if (file) {
      // Si un fichier est fourni, utiliser FormData
      const formData = new FormData();

      // Ajouter tous les champs du formulaire
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      // Ajouter le fichier avec la clé documentUrl
      formData.append("documentUrl", file);

      const response = await api.post(`/version_ptba/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } else {
      delete data.documentUrl;
      // Pas de fichier, utiliser JSON normal
      const response = await api.post(`/version_ptba/`, data);
      return response.data;
    }
  },

  async update(
    id: number,
    data: Partial<VersionPtbaFormData>,
    file?: File
  ): Promise<VersionPtba> {
    if (file) {
      // Si un fichier est fourni, utiliser FormData
      const formData = new FormData();

      // Ajouter tous les champs du formulaire
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      // Ajouter le fichier avec la clé documentUrl
      formData.append("documentUrl", file);

      const response = await api.put(`/version_ptba/${id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } else {
      delete data.documentUrl;
      // Pas de fichier, utiliser JSON normal
      const response = await api.put(`/version_ptba/${id}/`, data);
      return response.data;
    }
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/version_ptba/${id}/`);
  },

  async search(query: string): Promise<VersionPtba[]> {
    const response = await api.get(`/version_ptba/`, {
      params: { search: query },
    });
    return response.data;
  },

  async getByAnnee(annee: number): Promise<VersionPtba[]> {
    const response = await api.get(`/version_ptba/`, {
      params: { annee },
    });
    return response.data;
  },

  async getByStatut(statut: string): Promise<VersionPtba[]> {
    const response = await api.get(`/version_ptba/`, {
      params: { statut },
    });
    return response.data;
  },

  async valider(id: number): Promise<VersionPtba> {
    const response = await api.patch(`/version_ptba/${id}/valider/`);
    return response.data;
  },

  async archiver(id: number): Promise<VersionPtba> {
    const response = await api.patch(`/version_ptba/${id}/archiver/`);
    return response.data;
  },
};

export default versionPtbaService;
