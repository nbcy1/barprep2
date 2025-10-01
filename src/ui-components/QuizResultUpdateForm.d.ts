/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextAreaFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
import { QuizResult } from "../API.ts";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type QuizResultUpdateFormInputValues = {
    userId?: string;
    topic?: string;
    totalQuestions?: number;
    correctAnswers?: number;
    score?: number;
    questionsAsked?: string[];
    userAnswers?: string;
    completedAt?: string;
    owner?: string;
};
export declare type QuizResultUpdateFormValidationValues = {
    userId?: ValidationFunction<string>;
    topic?: ValidationFunction<string>;
    totalQuestions?: ValidationFunction<number>;
    correctAnswers?: ValidationFunction<number>;
    score?: ValidationFunction<number>;
    questionsAsked?: ValidationFunction<string>;
    userAnswers?: ValidationFunction<string>;
    completedAt?: ValidationFunction<string>;
    owner?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type QuizResultUpdateFormOverridesProps = {
    QuizResultUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    userId?: PrimitiveOverrideProps<TextFieldProps>;
    topic?: PrimitiveOverrideProps<TextFieldProps>;
    totalQuestions?: PrimitiveOverrideProps<TextFieldProps>;
    correctAnswers?: PrimitiveOverrideProps<TextFieldProps>;
    score?: PrimitiveOverrideProps<TextFieldProps>;
    questionsAsked?: PrimitiveOverrideProps<TextFieldProps>;
    userAnswers?: PrimitiveOverrideProps<TextAreaFieldProps>;
    completedAt?: PrimitiveOverrideProps<TextFieldProps>;
    owner?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type QuizResultUpdateFormProps = React.PropsWithChildren<{
    overrides?: QuizResultUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    quizResult?: QuizResult;
    onSubmit?: (fields: QuizResultUpdateFormInputValues) => QuizResultUpdateFormInputValues;
    onSuccess?: (fields: QuizResultUpdateFormInputValues) => void;
    onError?: (fields: QuizResultUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: QuizResultUpdateFormInputValues) => QuizResultUpdateFormInputValues;
    onValidate?: QuizResultUpdateFormValidationValues;
} & React.CSSProperties>;
export default function QuizResultUpdateForm(props: QuizResultUpdateFormProps): React.ReactElement;
