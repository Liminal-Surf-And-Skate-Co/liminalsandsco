import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { j as useNewsletters, g as sanitizeError, L as nextFridayISO, N as Nav, F as Footer } from "./router-BcrAlKxT.mjs";
import { I as Input, B as Button, L as Label } from "./label-CKnQI1IM.mjs";
import { c as cn } from "./utils-H80jjgLf.mjs";
import { u as useQueryClient, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-DYwJbDLa.mjs";
import { u as useForm, F as FormProvider, C as Controller, b as useFormContext } from "../_libs/react-hook-form.mjs";
import { u } from "../_libs/hookform__resolvers.mjs";
import { S as Slot } from "../_libs/radix-ui__react-slot.mjs";
import "../_libs/sonner.mjs";
import { O as ArrowLeft } from "../_libs/lucide-react.mjs";
import { o as objectType, b as booleanType, s as stringType } from "../_libs/zod.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__zod-adapter.mjs";
import "../_libs/date-fns.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
const Textarea = reactExports.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "textarea",
      {
        className: cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Textarea.displayName = "Textarea";
const Form = FormProvider;
const FormFieldContext = reactExports.createContext(null);
const FormField = ({
  ...props
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(FormFieldContext.Provider, { value: { name: props.name }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Controller, { ...props }) });
};
const useFormField = () => {
  const fieldContext = reactExports.useContext(FormFieldContext);
  const itemContext = reactExports.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();
  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }
  if (!itemContext) {
    throw new Error("useFormField should be used within <FormItem>");
  }
  const fieldState = getFieldState(fieldContext.name, formState);
  const { id } = itemContext;
  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState
  };
};
const FormItemContext = reactExports.createContext(null);
const FormItem = reactExports.forwardRef(
  ({ className, ...props }, ref) => {
    const id = reactExports.useId();
    return /* @__PURE__ */ jsxRuntimeExports.jsx(FormItemContext.Provider, { value: { id }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("space-y-2", className), ...props }) });
  }
);
FormItem.displayName = "FormItem";
const FormLabel = reactExports.forwardRef(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Label,
    {
      ref,
      className: cn(error && "text-destructive", className),
      htmlFor: formItemId,
      ...props
    }
  );
});
FormLabel.displayName = "FormLabel";
const FormControl = reactExports.forwardRef(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Slot,
    {
      ref,
      id: formItemId,
      "aria-describedby": !error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`,
      "aria-invalid": !!error,
      ...props
    }
  );
});
FormControl.displayName = "FormControl";
const FormDescription = reactExports.forwardRef(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "p",
    {
      ref,
      id: formDescriptionId,
      className: cn("text-[0.8rem] text-muted-foreground", className),
      ...props
    }
  );
});
FormDescription.displayName = "FormDescription";
const FormMessage = reactExports.forwardRef(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message ?? "") : children;
  if (!body) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "p",
    {
      ref,
      id: formMessageId,
      className: cn("text-[0.8rem] font-medium text-destructive", className),
      ...props,
      children: body
    }
  );
});
FormMessage.displayName = "FormMessage";
const schema = objectType({
  id: stringType().optional(),
  subject: stringType().min(1, "Subject is required"),
  excerpt: stringType().optional(),
  body: stringType().min(1, "Body is required"),
  scheduled_for: stringType().optional(),
  cover_image: stringType().optional(),
  links: stringType().optional(),
  published: booleanType()
});
function AdminNewslettersPage() {
  const {
    data: newsletters
  } = useNewsletters();
  const [editing, setEditing] = reactExports.useState(null);
  const qc = useQueryClient();
  const deleteN = useMutation({
    mutationFn: async (id) => {
      const {
        error
      } = await supabase.from("newsletters").delete().eq("id", id);
      if (error) throw new Error(sanitizeError(error));
    },
    onSuccess: () => qc.invalidateQueries({
      queryKey: ["newsletters"]
    })
  });
  const upsert = useMutation({
    mutationFn: async (n) => {
      const payload = {
        subject: n.subject,
        excerpt: n.excerpt || null,
        body: n.body,
        scheduled_for: n.scheduled_for || null,
        cover_image: n.cover_image || null,
        links: JSON.parse(n.links || "[]"),
        published: n.published
      };
      if (n.id) {
        const {
          error
        } = await supabase.from("newsletters").update(payload).eq("id", n.id);
        if (error) throw new Error(sanitizeError(error));
      } else {
        const {
          error
        } = await supabase.from("newsletters").insert(payload);
        if (error) throw new Error(sanitizeError(error));
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["newsletters"]
      });
      setEditing(null);
    }
  });
  const form = useForm({
    resolver: u(schema),
    defaultValues: {
      subject: "",
      excerpt: "",
      body: "",
      scheduled_for: nextFridayISO(),
      cover_image: "",
      links: "",
      published: true
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Nav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-16 border-b border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin", className: "inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-primary mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-3 w-3" }),
          " Back to admin"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-black text-4xl", children: "Newsletters" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6 py-10 grid lg:grid-cols-12 gap-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-8 space-y-6", children: [
          editing === "new" && /* @__PURE__ */ jsxRuntimeExports.jsx(Form, { ...form, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: form.handleSubmit(upsert.mutate), className: "bg-card border border-border/60 p-6 space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { control: form.control, name: "subject", render: ({
              field
            }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: "Subject" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { ...field }) })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { control: form.control, name: "excerpt", render: ({
              field
            }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: "Excerpt" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { ...field }) })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { control: form.control, name: "body", render: ({
              field
            }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: "Body" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { ...field, rows: 8 }) })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { control: form.control, name: "scheduled_for", render: ({
              field
            }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: "Scheduled for" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "datetime-local", ...field }) })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", children: "Save" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => setEditing(null), children: "Cancel" })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: (newsletters ?? []).map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/60 bg-card p-4 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-primary", children: n.subject ?? "Untitled" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-silver/60", children: n.scheduled_for ? new Date(n.scheduled_for).toLocaleString() : "Draft" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: () => setEditing(n.id), children: "Edit" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "destructive", onClick: () => deleteN.mutate(n.id), children: "Delete" })
            ] })
          ] }, n.id)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "w-full", onClick: () => {
          setEditing("new");
          form.reset();
        }, children: "+ New Newsletter" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
export {
  AdminNewslettersPage as component
};
