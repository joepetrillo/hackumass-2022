import { Button, Label, Modal, Spinner, TextInput } from "flowbite-react";
import { type FormEvent, useState } from "react";
import { trpc } from "../utils/trpc";

const CreateGroupModal = ({
  show,
  onClose,
}: {
  show: boolean;
  onClose: () => void;
}) => {
  const defaultForm = { accessCode: "" };
  const [formData, setFormData] = useState({ ...defaultForm });
  const [error, setError] = useState("");

  const joinGroupMutation = trpc.members.createMemberRelation.useMutation();
  const utils = trpc.useContext();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    const trigger = async () => {
      await joinGroupMutation.mutateAsync(formData);
    };
    const cleanup = async () => {
      setFormData({ ...defaultForm });
      onClose();
      utils.groups.invalidate();
    };
    e.preventDefault();
    await trigger();
    if (joinGroupMutation.isError) {
      setError(joinGroupMutation.error.message);
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
            Join New Group
          </h3>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="name" value="Access Code" />
            </div>
            <TextInput
              id="name"
              placeholder="My Group"
              required={true}
              onChange={(e) =>
                setFormData({ ...formData, accessCode: e.target.value })
              }
              value={formData.accessCode}
              disabled={joinGroupMutation.isLoading}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={joinGroupMutation.isLoading}
          >
            {joinGroupMutation.isLoading && (
              <div className="mr-3">
                <Spinner size="sm" light={true} />
              </div>
            )}
            Join Group
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateGroupModal;
