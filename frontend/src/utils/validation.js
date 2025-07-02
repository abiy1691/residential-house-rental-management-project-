export const validateForm = (formData, notRequired) => {
    let errors = {};
    Object.keys(formData).forEach((key) => {
        if (notRequired.includes(key))
            return
        if (formData[key] === '')
            errors[key] = 'This field is required!'
    });

    if (!notRequired.includes('phonenumber')&&formData.phonenumber && ! /^(9|7)\d{8}$/.test(formData.phonenumber))
        errors.phonenumber = "Wrong phone number format: (it's 9 digits and starts with 9 or 7)";
    if (formData.email && ! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        errors.email = "Wrong email format";
    if (formData.password && formData.password.length < 7)
        errors.password = 'Password too short';
    if (formData.password_confirmation && formData.password_confirmation != formData.password)
        errors.password_confirmation = 'Passwords doesn\'t match';

    return errors    
}