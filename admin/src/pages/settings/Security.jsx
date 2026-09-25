import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Lock, Shield, Key, Smartphone } from "lucide-react";
import Card from "../../components/ui/Card";
import Field, { PasswordInput } from "../../components/ui/Field";
import { PrimaryButton } from "../../components/ui/Button";

const Security = () => {
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <section className="w-full max-w-3xl">
      <div className="mb-6">
        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
          Settings
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
          Security
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage your password and account security.
        </p>
      </div>

      {/* Change Password */}
      <Card className="p-6 mb-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
            <Lock size={16} className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Change Password</h3>
            <p className="text-xs text-slate-500">
              Update your password regularly for security.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Current Password">
            <PasswordInput placeholder="Enter current password" required />
          </Field>
          <Field label="New Password">
            <PasswordInput placeholder="Enter new password" required />
          </Field>
          <Field label="Confirm New Password">
            <PasswordInput placeholder="Confirm new password" required />
          </Field>

          {saved && (
            <p className="text-green-600 text-xs bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              ✓ Password updated successfully.
            </p>
          )}

          <div className="flex justify-end">
            <PrimaryButton type="submit">Update Password</PrimaryButton>
          </div>
        </form>
      </Card>

      {/* 2FA */}
      <Card className="p-6 mb-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
              <Smartphone size={16} className="text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">
                Two-Factor Authentication
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Add an extra layer of security to your account. Coming soon.
              </p>
            </div>
          </div>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 border border-slate-300 rounded-full px-2 py-0.5">
            Coming Soon
          </span>
        </div>
      </Card>

      {/* Login Sessions */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
            <Shield size={16} className="text-purple-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Active Sessions</h3>
            <p className="text-xs text-slate-500">
              Devices currently logged into your account.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
              <Key size={16} className="text-slate-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800">
                Current Session
              </p>
              <p className="text-xs text-slate-500">This device • Active now</p>
            </div>
          </div>
          <span className="text-[10px] font-semibold text-green-600 bg-green-50 border border-green-200 rounded-full px-2 py-0.5">
            Active
          </span>
        </div>
      </Card>
    </section>
  );
};

export default Security;
