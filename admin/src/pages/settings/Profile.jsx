import { Link } from "react-router";
import { ArrowLeft, User, Mail, Shield, Building2, Save } from "lucide-react";
import Card from "../../components/ui/Card";
import Field, { Input } from "../../components/ui/Field";
import { PrimaryButton } from "../../components/ui/Button";

const Profile = () => {
  return (
    <section className="w-full max-w-3xl">
      <div className="mb-6">
        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
          Settings
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
          Profile
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Your account information and details.
        </p>
      </div>

      {/* Profile Header Card */}
      <Card className="p-6 mb-5">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <User size={32} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Admin</h2>
            <p className="text-sm text-slate-500">Super Administrator</p>
            <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-green-50 text-green-700 border border-green-200">
              <Shield size={10} /> Verified
            </span>
          </div>
        </div>
      </Card>

      {/* Personal Info */}
      <Card className="p-6">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <User size={16} className="text-blue-600" />
          Personal Information
        </h3>
        <form className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Full Name">
              <Input defaultValue="Admin" />
            </Field>
            <Field label="User ID">
              <Input defaultValue="admin" disabled className="!bg-slate-50" />
            </Field>
            <Field label="Email">
              <Input defaultValue="admin@enablingev.com" type="email" />
            </Field>
            <Field label="Mobile">
              <Input defaultValue="" placeholder="Not set" />
            </Field>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Building2 size={16} className="text-blue-600" />
              Company Information
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Company">
                <Input
                  defaultValue="Enabling E-Vehicle Private Limited"
                  disabled
                  className="!bg-slate-50"
                />
              </Field>
              <Field label="Role">
                <Input
                  defaultValue="Super Admin"
                  disabled
                  className="!bg-slate-50"
                />
              </Field>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <PrimaryButton type="button" className="gap-2">
              <Save size={16} />
              Save Changes
            </PrimaryButton>
          </div>
        </form>
      </Card>
    </section>
  );
};

export default Profile;
