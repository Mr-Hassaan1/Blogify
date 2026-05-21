import * as yup from "yup";

export const loginSchema = yup.object().shape({
    email: yup
        .string()
        .trim()
        .lowercase()
        .email("Enter a valid email")
        .required("Email is required"),
    password: yup
        .string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
});

export const signupSchema = yup.object().shape({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    email: yup
        .string()
        .trim()
        .lowercase()
        .email("Enter a valid email")
        .required("Email is required"),
    password: yup
        .string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
});

export const blogSchema = yup.object().shape({
    title: yup
        .string()
        .required("Title is required"),
    description: yup
        .string()
        .required("Description is required"),
    category: yup.string().required("Category is required"),
});

export const validateField = async (fieldName, value, schema) => {
    try {
        if (!schema || !schema.fields || !schema.fields[fieldName]) return null;
        await schema.fields[fieldName].validate(value);
        return null;
    } catch (error) {
        return error.message;
    }
};
