export function validateForm(nom, email, password) {
    const validateName = (name) => {
        if (name.length <= 0) {
            return 'Le nom ne peut être vide.';
        }
        return '';
    };

    const validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(email)) {
            return 'Veuillez entrer une adresse e-mail valide.';
        }
        return '';
    };

    const validatePassword = (password) => {
        if (password.length <= 0) {
            return 'Le mot de passe ne peut être vide.';
        }
        return '';
    };

    const nomError = validateName(nom);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    return { nomError, emailError, passwordError };
}

export function validateLoginForm(email, password) {


    const validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(email)) {
            return "Veuillez entrer une adresse e-mail valide.";
        }
        return "";
    };

    const validatePassword = (password) => {
        if (password.length <= 0) {
            return "Le mot de passe ne peut être vide.";
        }
        return "";
    };



    {
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);

        return { emailError, passwordError };
    }


}
