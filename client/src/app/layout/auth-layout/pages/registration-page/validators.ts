import {FormControl, FormGroup, ValidationErrors} from '@angular/forms';

export class RegisterValidators {

  /** Валидатор пароля */
  static passwordValidator(control: FormControl): ValidationErrors {
    const value = control.value;
    const charactersPassword: number = 8;

    /** Проверка на содержание цифр */
    const hasNumber = /[0-9]/.test(value);
    let hasNumberErrors: string;
    if(!hasNumber) { hasNumberErrors = 'Пароль должен содержать цифры'; }

    /** Проверка на содержание заглавных букв */
    const hasCapitalLetter = /[A-Z]/.test(value);
    let hasCapitalLetterErrors: string;
    if(!hasCapitalLetter) { hasCapitalLetterErrors = 'Пароль должен содержать заглавные буквы'; }


    /** Проверка на содержание прописных букв */
    const hasLowercaseLetter = /[a-z]/.test(value);
    let hasLowercaseLetterErrors: string;
    if(!hasLowercaseLetter) { hasLowercaseLetterErrors = 'Пароль должен содержать прописные буквы'; }


    /** Проверка на минимальную длину пароля */
    const isLengthValid = value ? value.length > charactersPassword : false;
    let isLengthValidErrors: string;
    if(!isLengthValid) { isLengthValidErrors = `Пароль должен содержать не менее ` + charactersPassword + ` символов`; }


    /** Общая проверка */
    const passwordValid = hasNumber && hasCapitalLetter && hasLowercaseLetter && isLengthValid;

    if (!passwordValid) {
      return {
        invalidPasswordHasLowercaseLetter: hasLowercaseLetterErrors,
        invalidPasswordHasNumber: hasNumberErrors,
        invalidPasswordHasCapitalLetter: hasCapitalLetterErrors,
        invalidPasswordIsLengthValid: isLengthValidErrors,
        invalidPassword: 'Пароль не допустим'
      };
    }
    return null;
  };


  static matchingPasswords(control: FormGroup):{ mismatch: string } {
    const pwd = control.get('password');
    const confirmPwd = control.get('confirmPassword');

    // If FormControl objects don't exist, return null
    if (!pwd || !confirmPwd) return null;

    //If they are indeed equal, return null
    if (pwd.value === confirmPwd.value) {
      return null;
    }
    //Else return false
    return {
      mismatch: 'Пароли не совподают'
    };
  }
}
