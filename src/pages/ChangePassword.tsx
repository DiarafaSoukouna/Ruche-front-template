import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon, KeyIcon, ArrowLeftIcon } from "lucide-react";
import { useMemo, useState } from "react";
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
    watch,
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const mutation = useMutation({
    mutationFn: async (data: ChangePasswordFormData) => {
      if (!user) throw new Error("Utilisateur non connecté");

      await authService.changePassword(user.n_personnel!, {
        currentPassword: data.oldPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmNewPassword,
      });
    },
    onSuccess: () => {
      toast.success("Mot de passe modifié avec succès ✅");
      reset();
      navigate("/dashboard");
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Erreur lors du changement de mot de passe ❌"
      );
    },
  });

  const onSubmit = (data: ChangePasswordFormData) => mutation.mutate(data);

  const newPassword = watch("newPassword");
  const passwordStrength = useMemo(() => {
    if (!newPassword) return "";
    const hasLower = /[a-z]/.test(newPassword);
    const hasUpper = /[A-Z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasLength = newPassword.length >= 8;
    const score = [hasLower, hasUpper, hasNumber, hasLength].filter(
      Boolean
    ).length;
    if (score <= 2) return "Faible";
    if (score === 3) return "Moyen";
    return "Fort";
  }, [newPassword]);

  return (
    <div className="min-h-screen bg-background py-8 text-foreground transition-colors">
      <div className="max-w-md mx-auto">
        <div className="bg-card text-card-foreground rounded-lg shadow-md p-6 transition-colors">
          {/* Header */}
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <div className="flex items-center">
              <KeyIcon className="w-6 h-6 text-primary mr-3" />
              <h1 className="text-2xl font-bold">Changer de mot de passe</h1>
            </div>
          </div>

          {/* User Info */}
          <div className="mb-6 p-4 bg-secondary text-secondary-foreground rounded-lg">
            <p className="text-sm">
              <span className="font-medium">Utilisateur :</span>{" "}
              {user?.prenom_perso || "Utilisateur"}
            </p>
            <p className="text-xs opacity-80">
              {user?.id_personnel_perso || ""}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Mot de passe actuel <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  {...register("oldPassword")}
                  autoComplete="current-password"
                  className="w-full px-3 py-2 pr-10 border border-input rounded-md bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="Entrez votre mot de passe actuel"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                >
                  {showCurrentPassword ? (
                    <EyeOffIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.oldPassword && (
                <p className="text-destructive text-sm mt-1">
                  {errors.oldPassword.message}
                </p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Nouveau mot de passe <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  {...register("newPassword")}
                  autoComplete="new-password"
                  className="w-full px-3 py-2 pr-10 border border-input rounded-md bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="Entrez votre nouveau mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                >
                  {showNewPassword ? (
                    <EyeOffIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-destructive text-sm mt-1">
                  {errors.newPassword.message}
                </p>
              )}
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-muted-foreground">
                  Min. 8 caractères, incluant majuscule, minuscule et chiffre
                </p>
                {newPassword && (
                  <p
                    className={`text-xs font-medium ${
                      passwordStrength === "Faible"
                        ? "text-destructive"
                        : passwordStrength === "Moyen"
                        ? "text-tertiary"
                        : "text-primary"
                    }`}
                  >
                    Force : {passwordStrength}
                  </p>
                )}
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Confirmer le nouveau mot de passe{" "}
                <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmNewPassword")}
                  autoComplete="new-password"
                  className="w-full px-3 py-2 pr-10 border border-input rounded-md bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="Confirmez votre nouveau mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmNewPassword && (
                <p className="text-destructive text-sm mt-1">
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
