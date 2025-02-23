"use client";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import { Link, Plus } from "lucide-react";
import React from "react";

export default function AddLinkComponent() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        isIconOnly
        className="fixed bottom-20 right-4 z-10"
        color="primary"
        size="lg"
        onPress={onOpen}
      >
        <Plus className="size-5" />
      </Button>
      {/*Model  */}
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        placement="bottom"
        size="2xl"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Add Link</ModalHeader>
          <ModalBody>
            <div className="min-h-40 flex flex-col gap-6">
              <Input
                errorMessage="Please enter valid url"
                placeholder="Enter Url..."
                size="lg"
                startContent={<Link className="text-default-500 size-5" />}
                type="email"
              />
              <Button color="primary" type="button">
                Add
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
