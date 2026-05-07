"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { employees } from "@/data/data";
import { eventDate, successMessage } from "@/config/content";

const PHONE_RE = /^[6-9]\d{9}$/;

function validate(fields) {
  const errors = {};
  if (!fields.employee) errors.employee = "Please select an employee.";
  if (!fields.channelPartnerName.trim()) errors.channelPartnerName = "Channel partner name is required.";
  if (!PHONE_RE.test(fields.mobileNumber)) errors.mobileNumber = "Enter a valid 10-digit mobile number starting with 6–9.";
  if (!PHONE_RE.test(fields.whatsappNumber)) errors.whatsappNumber = "Enter a valid 10-digit WhatsApp number starting with 6–9.";
  if (!fields.firmName.trim()) errors.firmName = "Firm name is required.";
  if (!fields.officeLocation.trim()) errors.officeLocation = "Office location is required.";
  if (!fields.place.trim()) errors.place = "Place is required.";
  return errors;
}

const fieldVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" },
  }),
};

const errorVariants = {
  hidden: { opacity: 0, x: -10, height: 0 },
  visible: { opacity: 1, x: 0, height: "auto", transition: { duration: 0.25 } },
  exit: { opacity: 0, height: 0, transition: { duration: 0.2 } },
};

function FloatingInput({ id, label, type = "text", value, onChange, onBlur, error, disabled, ...rest }) {
  const hasValue = value !== "";
  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={!!error}
        className={`peer w-full px-4 pt-5 pb-2 rounded-xl border bg-white/5 backdrop-blur-sm text-white placeholder-transparent focus:outline-none focus:ring-2 transition-all duration-200
          ${error ? "border-red-400 focus:ring-red-400/50" : "border-white/20 focus:ring-purple-400/50 focus:border-purple-400"}
          ${disabled ? "opacity-40 cursor-not-allowed" : "hover:border-white/40"}`}
        placeholder={label}
        {...rest}
      />
      <label
        htmlFor={id}
        className={`absolute left-4 text-sm transition-all duration-200 pointer-events-none
          ${hasValue || true
            ? "top-1.5 text-xs text-purple-300"
            : "top-3.5 text-white/50 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-purple-300"
          }
          ${error ? "text-red-400" : ""}
          ${disabled ? "opacity-40" : ""}`}
      >
        {label}
      </label>
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            role="alert"
            variants={errorVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="mt-1 text-xs text-red-400 flex items-center gap-1"
          >
            <span>⚠</span> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function SuccessScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "backOut" }}
      className="flex flex-col items-center justify-center py-12 px-6 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
        className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mb-6 shadow-lg shadow-green-500/30"
      >
        <motion.svg
          viewBox="0 0 52 52"
          className="w-12 h-12"
          initial="hidden"
          animate="visible"
        >
          <motion.circle
            cx="26" cy="26" r="25"
            fill="none"
            stroke="white"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          />
          <motion.path
            fill="none"
            stroke="white"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.1 27.2l7.1 7.2 16.7-16.8"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
          />
        </motion.svg>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-2xl font-bold text-white mb-3"
      >
        Registration Successful!
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="text-purple-200 text-sm max-w-xs"
      >
        {successMessage}
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-6 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-xs text-purple-200"
      >
        📅 Event Date: {eventDate}
      </motion.div>
    </motion.div>
  );
}

export default function RegistrationForm() {
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [fields, setFields] = useState({
    employee: null,
    channelPartnerName: "",
    mobileNumber: "",
    whatsappNumber: "",
    sameAsMobile: false,
    firmName: "",
    officeLocation: "",
    place: "",
  });
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return employees.filter((e) => e.name.toLowerCase().includes(q));
  }, [search]);

  const employeeSelected = !!fields.employee;

  const completedFields = useMemo(() => {
    const checks = [
      !!fields.employee,
      !!fields.channelPartnerName.trim(),
      PHONE_RE.test(fields.mobileNumber),
      PHONE_RE.test(fields.whatsappNumber),
      !!fields.firmName.trim(),
      !!fields.officeLocation.trim(),
      !!fields.place.trim(),
    ];
    return checks.filter(Boolean).length;
  }, [fields]);

  const progress = Math.round((completedFields / 7) * 100);

  function setField(key, val) {
    setFields((f) => {
      const next = { ...f, [key]: val };
      if (key === "mobileNumber" && next.sameAsMobile) {
        next.whatsappNumber = val;
      }
      return next;
    });
  }

  function handleBlur(key) {
    setTouched((t) => ({ ...t, [key]: true }));
    const errs = validate(fields);
    setErrors((e) => ({ ...e, [key]: errs[key] }));
  }

  function getError(key) {
    return touched[key] ? errors[key] : undefined;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const allTouched = {
      employee: true,
      channelPartnerName: true,
      mobileNumber: true,
      whatsappNumber: true,
      firmName: true,
      officeLocation: true,
      place: true,
    };
    setTouched(allTouched);
    const errs = validate(fields);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    setServerError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: fields.employee.id,
          employeeName: fields.employee.name,
          channelPartnerName: fields.channelPartnerName,
          mobileNumber: fields.mobileNumber,
          whatsappNumber: fields.whatsappNumber,
          firmName: fields.firmName,
          officeLocation: fields.officeLocation,
          place: fields.place,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setServerError(data.message || "Something went wrong. Please try again.");
      } else {
        setSubmitted(true);
      }
    } catch {
      setServerError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) return <SuccessScreen />;

  const formFields = [
    { key: "channelPartnerName", label: "Channel Partner Name", index: 0 },
    { key: "mobileNumber", label: "Mobile Number", index: 1, inputMode: "numeric", maxLength: 10 },
    { key: "whatsappNumber", label: "WhatsApp Number", index: 2, inputMode: "numeric", maxLength: 10 },
    { key: "firmName", label: "Firm Name", index: 3 },
    { key: "officeLocation", label: "Office Location", index: 4 },
    { key: "place", label: "Place", index: 5 },
  ];

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-purple-300">
          <span>Form completion</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Employee dropdown */}
      <div className="relative">
        <label className="block text-xs text-purple-300 mb-1.5 font-medium" htmlFor="employee-search">
          Employee Name <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <input
            id="employee-search"
            type="text"
            autoComplete="off"
            value={fields.employee ? fields.employee.name : search}
            onChange={(e) => {
              if (fields.employee) {
                setField("employee", null);
                setSearch(e.target.value);
              } else {
                setSearch(e.target.value);
              }
              setDropdownOpen(true);
            }}
            onFocus={() => setDropdownOpen(true)}
            onBlur={() => {
              setTimeout(() => setDropdownOpen(false), 150);
              handleBlur("employee");
            }}
            placeholder="Search employee name..."
            aria-label="Search employee"
            aria-expanded={dropdownOpen}
            aria-haspopup="listbox"
            className={`w-full px-4 py-3 rounded-xl border bg-white/5 backdrop-blur-sm text-white placeholder-white/30
              focus:outline-none focus:ring-2 transition-all duration-200
              ${getError("employee") ? "border-red-400 focus:ring-red-400/50" : "border-white/20 focus:ring-purple-400/50 focus:border-purple-400"}
              hover:border-white/40`}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
            {fields.employee ? "✓" : "▾"}
          </span>
        </div>

        <AnimatePresence>
          {dropdownOpen && (
            <motion.ul
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              role="listbox"
              className="absolute z-50 mt-1 w-full max-h-52 overflow-y-auto rounded-xl border border-white/20 bg-indigo-950/90 backdrop-blur-xl shadow-2xl"
            >
              {filtered.length === 0 ? (
                <li className="px-4 py-3 text-sm text-white/40">No employees found</li>
              ) : (
                filtered.map((emp) => (
                  <li
                    key={emp.id}
                    role="option"
                    aria-selected={fields.employee?.id === emp.id}
                    onMouseDown={() => {
                      setField("employee", emp);
                      setSearch("");
                      setDropdownOpen(false);
                      setTouched((t) => ({ ...t, employee: true }));
                      setErrors((e) => ({ ...e, employee: undefined }));
                    }}
                    className={`px-4 py-2.5 text-sm cursor-pointer transition-colors
                      ${fields.employee?.id === emp.id ? "bg-purple-600 text-white" : "text-white/80 hover:bg-white/10"}`}
                  >
                    {emp.name}
                  </li>
                ))
              )}
            </motion.ul>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {getError("employee") && (
            <motion.p
              role="alert"
              variants={errorVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="mt-1 text-xs text-red-400 flex items-center gap-1"
            >
              <span>⚠</span> {getError("employee")}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Remaining fields animate in after employee selected */}
      <AnimatePresence>
        {employeeSelected && (
          <>
            {formFields.map(({ key, label, index, ...inputProps }) => (
              <motion.div
                key={key}
                custom={index}
                variants={fieldVariants}
                initial="hidden"
                animate="visible"
              >
                {key === "whatsappNumber" ? (
                  <div className="space-y-2">
                    <FloatingInput
                      id={key}
                      label={label}
                      value={fields[key]}
                      onChange={(e) => setField(key, e.target.value.replace(/\D/g, "").slice(0, 10))}
                      onBlur={() => handleBlur(key)}
                      error={getError(key)}
                      disabled={fields.sameAsMobile}
                      {...inputProps}
                    />
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-purple-200 select-none">
                      <input
                        type="checkbox"
                        checked={fields.sameAsMobile}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setFields((f) => ({
                            ...f,
                            sameAsMobile: checked,
                            whatsappNumber: checked ? f.mobileNumber : f.whatsappNumber,
                          }));
                        }}
                        className="w-4 h-4 accent-purple-500"
                        aria-label="Same as mobile number"
                      />
                      Same as mobile number
                    </label>
                  </div>
                ) : (
                  <FloatingInput
                    id={key}
                    label={label}
                    value={fields[key]}
                    onChange={(e) =>
                      setField(
                        key,
                        key === "mobileNumber"
                          ? e.target.value.replace(/\D/g, "").slice(0, 10)
                          : e.target.value
                      )
                    }
                    onBlur={() => handleBlur(key)}
                    error={getError(key)}
                    {...inputProps}
                  />
                )}
              </motion.div>
            ))}

            {/* Event Date (read-only) */}
            <motion.div
              custom={6}
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="relative flex items-center px-4 py-3 rounded-xl border border-white/20 bg-white/5">
                <span className="mr-3 text-purple-300">📅</span>
                <div>
                  <p className="text-xs text-purple-300 leading-none">Event Date</p>
                  <p className="text-white font-medium mt-0.5">{eventDate}</p>
                </div>
                <span className="ml-auto text-xs text-white/30 bg-white/10 px-2 py-0.5 rounded-full">Fixed</span>
              </div>
            </motion.div>

            {/* Server error */}
            <AnimatePresence>
              {serverError && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  role="alert"
                  className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-400/30 text-red-300 text-sm"
                >
                  {serverError}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.div
              custom={7}
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: submitting ? 1 : 1.02 }}
                whileTap={{ scale: submitting ? 1 : 0.98 }}
                className="w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600
                  hover:from-purple-500 hover:via-indigo-500 hover:to-blue-500
                  focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent
                  disabled:opacity-70 disabled:cursor-not-allowed
                  shadow-lg shadow-purple-500/25 transition-all duration-200 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Submitting…
                  </>
                ) : (
                  "Register Now →"
                )}
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Locked state hint */}
      {!employeeSelected && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm text-white/30 pt-2"
        >
          ↑ Select an employee to unlock the form
        </motion.p>
      )}
    </form>
  );
}
