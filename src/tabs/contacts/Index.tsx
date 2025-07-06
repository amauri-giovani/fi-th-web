import { useState } from "react";
import type { CompanyContact } from "@/types/contact";
import ContactList from "./ContactList";
import GroupContactForm from "@/components/GroupContactForm";
import Button from "@/components/base/Button";
import { Undo2 } from "lucide-react";
import type { Group } from "@/types/group";

type Props = {
  group: Group;
};

export default function ContactsTab({ group }: Props) {
  const [selectedContact, setSelectedContact] = useState<CompanyContact | null>(null);
  const [creatingNew, setCreatingNew] = useState(false);
  const [reloadFlag, setReloadFlag] = useState(0);

  const handleSaved = () => {
    setCreatingNew(false);
    setSelectedContact(null);
    setReloadFlag(prev => prev + 1);
  };

  const handleCancel = () => {
    setCreatingNew(false);
    setSelectedContact(null);
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-primary">Contatos</h2>

        {(creatingNew || selectedContact) ? (
          <Button
            rounded
            variant="inverted"
            className="flex items-center"
            onClick={handleCancel}
          >
            <Undo2 className="w-4 h-4 mr-2" />
            Voltar à lista de contatos
          </Button>
        ) : (
          <Button onClick={() => setCreatingNew(true)} rounded>
            Novo contato
          </Button>
        )}
      </div>

      {!creatingNew && !selectedContact && (
        <ContactList
          groupId={group.id}
          key={reloadFlag}
          onSelect={(contact) => {
            setSelectedContact(contact);
            setCreatingNew(false);
          }}
        />
      )}

      {(creatingNew || selectedContact) && (
        <div className="mt-6">
          <GroupContactForm
            groupId={group.id}
            contact={selectedContact ?? undefined}
            onCancel={handleCancel}
            onSaved={handleSaved}
          />
        </div>
      )}
    </div>
  );
}
