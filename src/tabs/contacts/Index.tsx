import { useState } from "react";
import type { CompanyContact } from "@/types/contact";
import ContactList from "./ContactList";
import CompanyContactForm from "@/components/CompanyContactForm";
import Button from "@/components/base/Button";
import { Undo2 } from "lucide-react";
import type { Group } from "@/types/group";


type Props = {
  group: Group;
};

export default function ContactsTab({ group }: Props) {
  const [selectedContact, setSelectedContact] = useState<CompanyContact | null>(null);
  const [creatingNew, setCreatingNew] = useState(false);
  const [reloadFlag, setReloadFlag] = useState(0); // força recarregar lista

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
        ) : group.main_company ? (
          <Button onClick={() => setCreatingNew(true)} rounded>
            Novo contato
          </Button>
        ) : null}
      </div>

      {!group.main_company && !creatingNew && !selectedContact && (
        <p className="text-sm text-red-500 italic mb-4">
          Defina uma empresa principal no grupo antes de adicionar contatos.
        </p>
      )}

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
          {typeof group.main_company === "number" ? (
            <CompanyContactForm
              companyId={group.main_company}
              contact={selectedContact ?? undefined}
              onCancel={handleCancel}
              onSaved={handleSaved}
            />
          ) : (
            <p className="text-sm text-red-500 italic">
              Defina uma empresa principal no grupo antes de cadastrar contatos.
            </p>
          )}
        </div>
      )}
    </div>
  );

}
