import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon, KeyIcon, ArrowLeftIcon } from "lucide-react";
import { useState } from "react";
import Button from "../components/Button";
import { useAuth } from "../contexts/AuthContext";
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from "../schemas/changePasswordSchema";
import { authService } from "../services/authService";

export default function ChangePassword() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const mutation = useMutation({
    mutationFn: async (data: ChangePasswordFormData) => {
      if (!user) {
        throw new Error("Utilisateur non connecté");
      }

      await authService.changePassword(user.n_personnel!, {
        currentPassword: data.oldPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmNewPassword,
      });
      toast.success("Mot de passe modifié avec succès");
      reset();
      navigate("/dashboard");
    },
    onSuccess: () => {},
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors du changement de mot de passe");
    },
  });

  const onSubmit = (data: ChangePasswordFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Header */}
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <div className="flex items-center">
              <KeyIcon className="w-6 h-6 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                Changer de mot de passe
              </h1>
            </div>
          </div>

          {/* User Info */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Utilisateur:</span>{" "}
              {user?.prenom_perso || "Utilisateur"}
            </p>
            <p className="text-xs text-blue-600">
              {user?.id_personnel_perso || ""}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe actuel <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  {...register("oldPassword")}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Entrez votre mot de passe actuel"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? (
                    <EyeOffIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.oldPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.oldPassword.message}
                </p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nouveau mot de passe <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  {...register("newPassword")}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Entrez votre nouveau mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? (
                    <EyeOffIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.newPassword.message}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Le mot de passe doit contenir au moins 8 caractères avec une
                minuscule, une majuscule et un chiffre
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmer le nouveau mot de passe{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmNewPassword")}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Confirmez votre nouveau mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmNewPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmNewPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="flex-1"
              >
                {mutation.isPending
                  ? "Modification..."
                  : "Modifier le mot de passe"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
