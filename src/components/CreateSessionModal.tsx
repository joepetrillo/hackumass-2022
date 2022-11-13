import { Button, Label, Modal, TextInput } from "flowbite-react";
import {
  type FormEvent,
  useState,
  ChangeEvent,
  Dispatch,
  SetStateAction,
  MouseEventHandler,
} from "react";
import { trpc } from "../utils/trpc";

const MAX_QUESTIONS = 20;

type QuestionDataType = {
  correct: number;
  numOptions: number;
};

type SessionFormDataType = {
  name: string;
  questions: QuestionDataType[];
};

const QuestionInput = ({
  num,
  questionOptions,
  formData,
  setFormData,
}: {
  num: number;
  questionOptions: QuestionDataType;
  formData: SessionFormDataType;
  setFormData: Dispatch<
    SetStateAction<{
      name: string;
      questions: QuestionDataType[];
    }>
  >;
}) => {
  function handleNewAnswerChoice(
    e: React.MouseEvent<HTMLElement>,
    idx: number,
    num: number
  ) {
    const questions = [...formData.questions];
    if (
      !questions ||
      !questions[num] ||
      !questions[num]?.numOptions === undefined
    ) {
      return;
    }
    questions[num]!.correct = idx;

    setFormData({
      ...formData,
      questions: questions,
    });
  }

  const updateOptionCount = (e: ChangeEvent<HTMLInputElement>) => {
    const questions = [...formData.questions];
    if (
      !questions ||
      !questions[num] ||
      !questions[num]?.numOptions === undefined
    ) {
      console.log("entering");
      return;
    }
    console.log(Number(e.target.value));

    if (questions[num]!.correct >= Number(e.target.value)) {
      questions[num]!.correct = Number(e.target.value) - 1;
    }

    questions[num]!.numOptions = Number(e.target.value);

    setFormData({
      ...formData,
      questions: questions,
    });
  };
  return (
    <div className="py-2">
      <div>
        <p className="text-lg">Q{num + 1}</p>
        <TextInput
          id={`q${num + 1}`}
          type="number"
          placeholder="1"
          max={5}
          min={1}
          value={formData.questions[num]?.numOptions}
          onChange={updateOptionCount}
          required={true}
          className="py-2"
        />
      </div>
      <div className="mt-2 flex gap-1">
        {[...new Array(questionOptions.numOptions).keys()].map(
          (idx: number) => (
            <Button
              color={
                formData.questions[num]?.correct === idx ? "success" : "dark"
              }
              key={idx}
              className="uppercase"
              onClick={(e) => handleNewAnswerChoice(e, idx, num)}
            >
              {String.fromCharCode(idx + 97)}
            </Button>
          )
        )}
      </div>
    </div>
  );
};

const CreateSessionModal = ({
  show,
  toggleOpen,
  groupId,
}: {
  show: boolean;
  toggleOpen: () => void;
  groupId: string;
}) => {
  const defaultForm: SessionFormDataType = { name: "", questions: [] };

  const defaultQuestion: QuestionDataType = {
    correct: 0,
    numOptions: 1,
  };

  const [formData, setFormData] = useState({ ...defaultForm });
  const [error, setError] = useState("");

  const createSessionMutation = trpc.groupSessions.createSession.useMutation();
  const utils = trpc.useContext();

  const deltaQuestion = (action: "INC" | "DEC") => {
    if (action === "INC" && formData.questions.length >= MAX_QUESTIONS) return;
    if (action === "DEC" && formData.questions.length <= 0) return;

    let questions: QuestionDataType[] = [];

    if (action === "INC") {
      questions = [...formData.questions, { ...defaultQuestion }];
    } else if (action === "DEC") {
      questions = [
        ...formData.questions.slice(0, formData.questions.length - 1),
      ];
    }

    setFormData({
      ...formData,
      questions: questions,
    });
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    const trigger = async () => {
      await createSessionMutation.mutateAsync({
        name: formData.name,
        questions: formData.questions.map((q) => {
          return {
            numOptions: q.numOptions,
            correct: String.fromCharCode(q.correct + 97),
          };
        }),
        groupId: groupId,
      });
    };
    const cleanup = async () => {
      setFormData({ ...defaultForm });
      toggleOpen();
      utils.groupSessions.invalidate();
    };
    e.preventDefault();
    await trigger();
    if (createSessionMutation.isError) {
      setError(createSessionMutation.error.message);
    } else {
      cleanup();
    }
  }

  return (
    <Modal show={show} size="md" popup={true} onClose={toggleOpen}>
      <Modal.Header />
      <Modal.Body>
        <form
          className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8"
          onSubmit={handleSubmit}
        >
          {error && <p>{error}</p>}
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            Create New Session
          </h3>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="name" value="Session Name" />
            </div>
            <TextInput
              id="name"
              placeholder="My Session"
              required={true}
              onChange={(e) =>
                setFormData({ ...formData, name: e.currentTarget.value })
              }
              value={formData.name}
              disabled={createSessionMutation.isLoading}
            />
          </div>
          <div>
            <Label htmlFor="name" value="Questions" />
            {formData.questions.map((q, idx) => (
              <QuestionInput
                key={idx}
                num={idx}
                questionOptions={q}
                formData={formData}
                setFormData={setFormData}
              />
            ))}
          </div>
          <div className="flex ">
            <Button
              className="mr-1"
              onClick={() => deltaQuestion("INC")}
              disabled={
                createSessionMutation.isLoading ||
                formData.questions.length >= MAX_QUESTIONS
              }
            >
              +
            </Button>
            <Button
              onClick={() => deltaQuestion("DEC")}
              className="mx-1"
              disabled={
                createSessionMutation.isLoading ||
                formData.questions.length <= 0
              }
            >
              -
            </Button>
            <Button
              type="submit"
              className="ml-1 w-full"
              disabled={createSessionMutation.isLoading}
            >
              Create
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateSessionModal;
