import {
  Button,
  Label,
  Modal,
  Spinner,
  Textarea,
  TextInput,
} from "flowbite-react";
import { type FormEvent, useState } from "react";
import { trpc } from "../utils/trpc";

const CreateGroupModal = ({
  show,
  onClose,
}: {
  show: boolean;
  onClose: () => void;
}) => {
  const defaultForm = { name: "", description: "" };
  const [formData, setFormData] = useState({ ...defaultForm });
  const [error, setError] = useState("");

  const createGroupMutation = trpc.groups.createGroup.useMutation();
  const utils = trpc.useContext();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    const trigger = async () => {
      await createGroupMutation.mutateAsync(formData);
    };
    const cleanup = async () => {
      setFormData({ ...defaultForm });
      onClose();
      utils.groups.invalidate();
    };
    e.preventDefault();
    await trigger();
    if (createGroupMutation.isError) {
      setError(createGroupMutation.error.message);
    } else {
      cleanup();
    }
  }

  return (
    <Modal show={show} size="md" popup={true} onClose={onClose}>
      <Modal.Header />
      <Modal.Body>
        <form
          className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8"
          onSubmit={handleSubmit}
        >
          {error && <p>{error}</p>}
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            Create New Group
          </h3>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="name" value="Group Name" />
            </div>
            <TextInput
              id="name"
              placeholder="My Group"
              required={true}
              onChange={(e) =>
                setFormData({ ...formData, name: e.currentTarget.value })
              }
              value={formData.name}
              disabled={createGroupMutation.isLoading}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="description" value="Description" />
            </div>
            <Textarea
              id="description"
              placeholder="A short description..."
              required={false}
              rows={3}
              maxLength={200}
              onChange={(e) =>
                setFormData({ ...formData, description: e.currentTarget.value })
              }
              value={formData.description}
              disabled={createGroupMutation.isLoading}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={createGroupMutation.isLoading}
          >
            {createGroupMutation.isLoading && (
              <div className="mr-3">
                <Spinner size="sm" light={true} />
              </div>
            )}
            Create Group
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateGroupModal;
