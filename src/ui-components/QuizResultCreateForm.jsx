/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import {
  Badge,
  Button,
  Divider,
  Flex,
  Grid,
  Icon,
  ScrollView,
  Text,
  TextAreaField,
  TextField,
  useTheme,
} from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { createQuizResult } from "../graphql/mutations";
const client = generateClient();
function ArrayField({
  items = [],
  onChange,
  label,
  inputFieldRef,
  children,
  hasError,
  setFieldValue,
  currentFieldValue,
  defaultFieldValue,
  lengthLimit,
  getBadgeText,
  runValidationTasks,
  errorMessage,
}) {
  const labelElement = <Text>{label}</Text>;
  const {
    tokens: {
      components: {
        fieldmessages: { error: errorStyles },
      },
    },
  } = useTheme();
  const [selectedBadgeIndex, setSelectedBadgeIndex] = React.useState();
  const [isEditing, setIsEditing] = React.useState();
  React.useEffect(() => {
    if (isEditing) {
      inputFieldRef?.current?.focus();
    }
  }, [isEditing]);
  const removeItem = async (removeIndex) => {
    const newItems = items.filter((value, index) => index !== removeIndex);
    await onChange(newItems);
    setSelectedBadgeIndex(undefined);
  };
  const addItem = async () => {
    const { hasError } = runValidationTasks();
    if (
      currentFieldValue !== undefined &&
      currentFieldValue !== null &&
      currentFieldValue !== "" &&
      !hasError
    ) {
      const newItems = [...items];
      if (selectedBadgeIndex !== undefined) {
        newItems[selectedBadgeIndex] = currentFieldValue;
        setSelectedBadgeIndex(undefined);
      } else {
        newItems.push(currentFieldValue);
      }
      await onChange(newItems);
      setIsEditing(false);
    }
  };
  const arraySection = (
    <React.Fragment>
      {!!items?.length && (
        <ScrollView height="inherit" width="inherit" maxHeight={"7rem"}>
          {items.map((value, index) => {
            return (
              <Badge
                key={index}
                style={{
                  cursor: "pointer",
                  alignItems: "center",
                  marginRight: 3,
                  marginTop: 3,
                  backgroundColor:
                    index === selectedBadgeIndex ? "#B8CEF9" : "",
                }}
                onClick={() => {
                  setSelectedBadgeIndex(index);
                  setFieldValue(items[index]);
                  setIsEditing(true);
                }}
              >
                {getBadgeText ? getBadgeText(value) : value.toString()}
                <Icon
                  style={{
                    cursor: "pointer",
                    paddingLeft: 3,
                    width: 20,
                    height: 20,
                  }}
                  viewBox={{ width: 20, height: 20 }}
                  paths={[
                    {
                      d: "M10 10l5.09-5.09L10 10l5.09 5.09L10 10zm0 0L4.91 4.91 10 10l-5.09 5.09L10 10z",
                      stroke: "black",
                    },
                  ]}
                  ariaLabel="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    removeItem(index);
                  }}
                />
              </Badge>
            );
          })}
        </ScrollView>
      )}
      <Divider orientation="horizontal" marginTop={5} />
    </React.Fragment>
  );
  if (lengthLimit !== undefined && items.length >= lengthLimit && !isEditing) {
    return (
      <React.Fragment>
        {labelElement}
        {arraySection}
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      {labelElement}
      {isEditing && children}
      {!isEditing ? (
        <>
          <Button
            onClick={() => {
              setIsEditing(true);
            }}
          >
            Add item
          </Button>
          {errorMessage && hasError && (
            <Text color={errorStyles.color} fontSize={errorStyles.fontSize}>
              {errorMessage}
            </Text>
          )}
        </>
      ) : (
        <Flex justifyContent="flex-end">
          {(currentFieldValue || isEditing) && (
            <Button
              children="Cancel"
              type="button"
              size="small"
              onClick={() => {
                setFieldValue(defaultFieldValue);
                setIsEditing(false);
                setSelectedBadgeIndex(undefined);
              }}
            ></Button>
          )}
          <Button size="small" variation="link" onClick={addItem}>
            {selectedBadgeIndex !== undefined ? "Save" : "Add"}
          </Button>
        </Flex>
      )}
      {arraySection}
    </React.Fragment>
  );
}
export default function QuizResultCreateForm(props) {
  const {
    clearOnSuccess = true,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    userId: "",
    topic: "",
    totalQuestions: "",
    correctAnswers: "",
    score: "",
    questionsAsked: [],
    userAnswers: "",
    completedAt: "",
    owner: "",
  };
  const [userId, setUserId] = React.useState(initialValues.userId);
  const [topic, setTopic] = React.useState(initialValues.topic);
  const [totalQuestions, setTotalQuestions] = React.useState(
    initialValues.totalQuestions
  );
  const [correctAnswers, setCorrectAnswers] = React.useState(
    initialValues.correctAnswers
  );
  const [score, setScore] = React.useState(initialValues.score);
  const [questionsAsked, setQuestionsAsked] = React.useState(
    initialValues.questionsAsked
  );
  const [userAnswers, setUserAnswers] = React.useState(
    initialValues.userAnswers
  );
  const [completedAt, setCompletedAt] = React.useState(
    initialValues.completedAt
  );
  const [owner, setOwner] = React.useState(initialValues.owner);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setUserId(initialValues.userId);
    setTopic(initialValues.topic);
    setTotalQuestions(initialValues.totalQuestions);
    setCorrectAnswers(initialValues.correctAnswers);
    setScore(initialValues.score);
    setQuestionsAsked(initialValues.questionsAsked);
    setCurrentQuestionsAskedValue("");
    setUserAnswers(initialValues.userAnswers);
    setCompletedAt(initialValues.completedAt);
    setOwner(initialValues.owner);
    setErrors({});
  };
  const [currentQuestionsAskedValue, setCurrentQuestionsAskedValue] =
    React.useState("");
  const questionsAskedRef = React.createRef();
  const validations = {
    userId: [{ type: "Required" }],
    topic: [{ type: "Required" }],
    totalQuestions: [{ type: "Required" }],
    correctAnswers: [{ type: "Required" }],
    score: [{ type: "Required" }],
    questionsAsked: [],
    userAnswers: [{ type: "JSON" }],
    completedAt: [{ type: "Required" }],
    owner: [],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  const convertToLocal = (date) => {
    const df = new Intl.DateTimeFormat("default", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      calendar: "iso8601",
      numberingSystem: "latn",
      hourCycle: "h23",
    });
    const parts = df.formatToParts(date).reduce((acc, part) => {
      acc[part.type] = part.value;
      return acc;
    }, {});
    return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          userId,
          topic,
          totalQuestions,
          correctAnswers,
          score,
          questionsAsked,
          userAnswers,
          completedAt,
          owner,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await client.graphql({
            query: createQuizResult.replaceAll("__typename", ""),
            variables: {
              input: {
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
          if (clearOnSuccess) {
            resetStateValues();
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "QuizResultCreateForm")}
      {...rest}
    >
      <TextField
        label="User id"
        isRequired={true}
        isReadOnly={false}
        value={userId}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              userId: value,
              topic,
              totalQuestions,
              correctAnswers,
              score,
              questionsAsked,
              userAnswers,
              completedAt,
              owner,
            };
            const result = onChange(modelFields);
            value = result?.userId ?? value;
          }
          if (errors.userId?.hasError) {
            runValidationTasks("userId", value);
          }
          setUserId(value);
        }}
        onBlur={() => runValidationTasks("userId", userId)}
        errorMessage={errors.userId?.errorMessage}
        hasError={errors.userId?.hasError}
        {...getOverrideProps(overrides, "userId")}
      ></TextField>
      <TextField
        label="Topic"
        isRequired={true}
        isReadOnly={false}
        value={topic}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              userId,
              topic: value,
              totalQuestions,
              correctAnswers,
              score,
              questionsAsked,
              userAnswers,
              completedAt,
              owner,
            };
            const result = onChange(modelFields);
            value = result?.topic ?? value;
          }
          if (errors.topic?.hasError) {
            runValidationTasks("topic", value);
          }
          setTopic(value);
        }}
        onBlur={() => runValidationTasks("topic", topic)}
        errorMessage={errors.topic?.errorMessage}
        hasError={errors.topic?.hasError}
        {...getOverrideProps(overrides, "topic")}
      ></TextField>
      <TextField
        label="Total questions"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={totalQuestions}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              userId,
              topic,
              totalQuestions: value,
              correctAnswers,
              score,
              questionsAsked,
              userAnswers,
              completedAt,
              owner,
            };
            const result = onChange(modelFields);
            value = result?.totalQuestions ?? value;
          }
          if (errors.totalQuestions?.hasError) {
            runValidationTasks("totalQuestions", value);
          }
          setTotalQuestions(value);
        }}
        onBlur={() => runValidationTasks("totalQuestions", totalQuestions)}
        errorMessage={errors.totalQuestions?.errorMessage}
        hasError={errors.totalQuestions?.hasError}
        {...getOverrideProps(overrides, "totalQuestions")}
      ></TextField>
      <TextField
        label="Correct answers"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={correctAnswers}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              userId,
              topic,
              totalQuestions,
              correctAnswers: value,
              score,
              questionsAsked,
              userAnswers,
              completedAt,
              owner,
            };
            const result = onChange(modelFields);
            value = result?.correctAnswers ?? value;
          }
          if (errors.correctAnswers?.hasError) {
            runValidationTasks("correctAnswers", value);
          }
          setCorrectAnswers(value);
        }}
        onBlur={() => runValidationTasks("correctAnswers", correctAnswers)}
        errorMessage={errors.correctAnswers?.errorMessage}
        hasError={errors.correctAnswers?.hasError}
        {...getOverrideProps(overrides, "correctAnswers")}
      ></TextField>
      <TextField
        label="Score"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={score}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              userId,
              topic,
              totalQuestions,
              correctAnswers,
              score: value,
              questionsAsked,
              userAnswers,
              completedAt,
              owner,
            };
            const result = onChange(modelFields);
            value = result?.score ?? value;
          }
          if (errors.score?.hasError) {
            runValidationTasks("score", value);
          }
          setScore(value);
        }}
        onBlur={() => runValidationTasks("score", score)}
        errorMessage={errors.score?.errorMessage}
        hasError={errors.score?.hasError}
        {...getOverrideProps(overrides, "score")}
      ></TextField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              userId,
              topic,
              totalQuestions,
              correctAnswers,
              score,
              questionsAsked: values,
              userAnswers,
              completedAt,
              owner,
            };
            const result = onChange(modelFields);
            values = result?.questionsAsked ?? values;
          }
          setQuestionsAsked(values);
          setCurrentQuestionsAskedValue("");
        }}
        currentFieldValue={currentQuestionsAskedValue}
        label={"Questions asked"}
        items={questionsAsked}
        hasError={errors?.questionsAsked?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks("questionsAsked", currentQuestionsAskedValue)
        }
        errorMessage={errors?.questionsAsked?.errorMessage}
        setFieldValue={setCurrentQuestionsAskedValue}
        inputFieldRef={questionsAskedRef}
        defaultFieldValue={""}
      >
        <TextField
          label="Questions asked"
          isRequired={false}
          isReadOnly={false}
          value={currentQuestionsAskedValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.questionsAsked?.hasError) {
              runValidationTasks("questionsAsked", value);
            }
            setCurrentQuestionsAskedValue(value);
          }}
          onBlur={() =>
            runValidationTasks("questionsAsked", currentQuestionsAskedValue)
          }
          errorMessage={errors.questionsAsked?.errorMessage}
          hasError={errors.questionsAsked?.hasError}
          ref={questionsAskedRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "questionsAsked")}
        ></TextField>
      </ArrayField>
      <TextAreaField
        label="User answers"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              userId,
              topic,
              totalQuestions,
              correctAnswers,
              score,
              questionsAsked,
              userAnswers: value,
              completedAt,
              owner,
            };
            const result = onChange(modelFields);
            value = result?.userAnswers ?? value;
          }
          if (errors.userAnswers?.hasError) {
            runValidationTasks("userAnswers", value);
          }
          setUserAnswers(value);
        }}
        onBlur={() => runValidationTasks("userAnswers", userAnswers)}
        errorMessage={errors.userAnswers?.errorMessage}
        hasError={errors.userAnswers?.hasError}
        {...getOverrideProps(overrides, "userAnswers")}
      ></TextAreaField>
      <TextField
        label="Completed at"
        isRequired={true}
        isReadOnly={false}
        type="datetime-local"
        value={completedAt && convertToLocal(new Date(completedAt))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              userId,
              topic,
              totalQuestions,
              correctAnswers,
              score,
              questionsAsked,
              userAnswers,
              completedAt: value,
              owner,
            };
            const result = onChange(modelFields);
            value = result?.completedAt ?? value;
          }
          if (errors.completedAt?.hasError) {
            runValidationTasks("completedAt", value);
          }
          setCompletedAt(value);
        }}
        onBlur={() => runValidationTasks("completedAt", completedAt)}
        errorMessage={errors.completedAt?.errorMessage}
        hasError={errors.completedAt?.hasError}
        {...getOverrideProps(overrides, "completedAt")}
      ></TextField>
      <TextField
        label="Owner"
        isRequired={false}
        isReadOnly={false}
        value={owner}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              userId,
              topic,
              totalQuestions,
              correctAnswers,
              score,
              questionsAsked,
              userAnswers,
              completedAt,
              owner: value,
            };
            const result = onChange(modelFields);
            value = result?.owner ?? value;
          }
          if (errors.owner?.hasError) {
            runValidationTasks("owner", value);
          }
          setOwner(value);
        }}
        onBlur={() => runValidationTasks("owner", owner)}
        errorMessage={errors.owner?.errorMessage}
        hasError={errors.owner?.hasError}
        {...getOverrideProps(overrides, "owner")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Clear"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          {...getOverrideProps(overrides, "ClearButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={Object.values(errors).some((e) => e?.hasError)}
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
