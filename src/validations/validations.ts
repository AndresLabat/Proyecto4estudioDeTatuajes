import { Appointment } from "../models/Appointment";
import { User } from "../models/User";

const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (!email) {
        return "you must insert an email"
    }

    if (typeof (email) !== "string") {
        return 'Incorrect email, it should only contain strings'
    };

    if (email.length > 100) {
        return 'Email is too long, please try a shorter one. Maximum 100 characters'
    };

    if (!emailRegex.test(email)) {
        return 'Incorrect email format. Please try again'
    };
};

const validateDate = (date: string) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!date) {
        return "you must insert a date"
    }

    if (typeof (date) !== "string") {
        return "date incorrect, you can put only strings, try again"
    };

    if (!dateRegex.test(date)) {
        return "date incorrect, The date format should be YYYY-MM-DD, try again"
    };
};

const validateShift = (shift: string) => {
    if (!shift) {
        return "you must insert a shift"
    }

    if (typeof (shift) !== "string") {
        return "shift incorrect, you can put only strings, try again"
    };


    if (shift !== "morning" && shift !== "afternoon") {
        return "shift incorrect, you only can put morning or afternoon, try again"
    };

};

const validateNamePurchase = (purchase: string) => {
    if (!purchase) {
        return "you must insert an name"
    }

    if (typeof (purchase) !== "string") {
        return 'name incorrect, you can put only strings, try again'
    }

    if (purchase.length == 0) {
        return 'name too short, try to insert a larger name, max 100 characters'
    };

    if (purchase.length > 100) {
        return 'name too long, try to insert a shorter name, max 100 characters'
    }
};

export { validateDate, validateNamePurchase, validateShift, validateEmail }