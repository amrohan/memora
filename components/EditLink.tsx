"use client";
import { Button } from "@heroui/button";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@heroui/drawer";
import { Image } from "@heroui/image";
import { Input } from "@heroui/input";
import { useDisclosure } from "@heroui/modal";
import { Tooltip } from "@heroui/tooltip";
import { Heart, Save, Trash } from "lucide-react";
import { useState } from "react";

export default function Edit() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [editing, setEditing] = useState(false);

  return (
    <>
      <Button
        color="primary"
        endContent={
          <svg
            height="16"
            viewBox="0 0 16 16"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.75 1.25a.75.75 0 1 0-1.5 0v.823l-.392.044c-.9.121-1.658.38-2.26.982s-.861 1.36-.982 2.26C.5 6.225.5 7.328.5 8.695v.11l.117 3.337c.121.9.38 1.658.982 2.26s1.36.861 2.26.982c.867.117 1.969.117 3.337.117h1.658l3.337-.117c.9-.121 1.658-.38 2.26-.982s.861-1.36.982-2.26c.117-.867.117-1.969.117-3.337v-.11l-.117-3.337c-.121-.9-.38-1.658-.982-2.26s-1.36-.861-2.26-.982l-.44-.048V1.25a.75.75 0 0 0-1.5 0v.756L8.853 2H7.195q-.78-.002-1.445.006zm4.5 3v-.744L8.798 3.5H7.25l-1.5.007v.743a.75.75 0 1 1-1.5 0v-.67l-.192.023c-.734.099-1.122.279-1.399.556s-.457.665-.556 1.399C2.002 6.313 2 7.315 2 8.75l.103 3.192c.099.734.279 1.122.556 1.399s.665.457 1.399.556c.755.101 1.756.103 3.192.103h1.548l3.192-.103c.734-.099 1.122-.279 1.399-.556s.457-.665.556-1.399c.102-.755.103-1.757.103-3.192l-.103-3.192c-.099-.734-.279-1.122-.556-1.399s-.665-.457-1.399-.556l-.241-.028v.675a.75.75 0 0 1-1.5 0zm-5 3.5a.75.75 0 1 1-1.5 0 .75.75 0 1 1 1.5 0m0 3.5a.75.75 0 1 1-1.5 0 .75.75 0 1 1 1.5 0M8 8.5A.75.75 0 1 0 8 7a.75.75 0 1 0 0 1.5m.75 2.75a.75.75 0 1 1-1.5 0 .75.75 0 1 1 1.5 0M11.5 8.5a.75.75 0 1 0 0-1.5.75.75 0 1 0 0 1.5m.75 2.75a.75.75 0 1 1-1.5 0 .75.75 0 1 1 1.5 0"
              fill="currentColor"
              fillRule="evenodd"
            />
          </svg>
        }
        variant="flat"
        onPress={onOpen}
      >
        See Event
      </Button>
      <Drawer
        hideCloseButton
        backdrop="blur"
        classNames={{
          base: "data-[placement=right]:sm:m-2 data-[placement=left]:sm:m-2  rounded-medium",
        }}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="absolute top-0 inset-x-0 z-50 flex flex-row gap-2 px-2 py-2 border-b border-default-200/50 justify-between bg-content1/50 backdrop-saturate-150 backdrop-blur-lg">
                <Tooltip content="Close">
                  <Button
                    isIconOnly
                    className="text-default-400"
                    size="sm"
                    variant="light"
                    onPress={onClose}
                  >
                    <svg
                      fill="none"
                      height="20"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="m13 17 5-5-5-5M6 17l5-5-5-5" />
                    </svg>
                  </Button>
                </Tooltip>
                <div className="w-full flex justify-end gap-2">
                  <Button
                    className="font-medium text-small text-default-500"
                    size="sm"
                    startContent={
                      <svg
                        height="16"
                        viewBox="0 0 16 16"
                        width="16"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3.85.75c-.908 0-1.702.328-2.265.933-.558.599-.835 1.41-.835 2.29V7.88c0 .801.23 1.548.697 2.129.472.587 1.15.96 1.951 1.06a.75.75 0 1 0 .185-1.489c-.435-.054-.752-.243-.967-.51-.219-.273-.366-.673-.366-1.19V3.973c0-.568.176-.993.433-1.268.25-.27.632-.455 1.167-.455h4.146c.479 0 .828.146 1.071.359.246.215.43.54.497.979a.75.75 0 0 0 1.483-.23c-.115-.739-.447-1.4-.99-1.877C9.51 1 8.796.75 7.996.75zM7.9 4.828c-.908 0-1.702.326-2.265.93-.558.6-.835 1.41-.835 2.29v3.905c0 .879.275 1.69.833 2.289.563.605 1.357.931 2.267.931h4.144c.91 0 1.705-.326 2.268-.931.558-.599.833-1.41.833-2.289V8.048c0-.879-.275-1.69-.833-2.289-.563-.605-1.357-.931-2.267-.931zm-1.6 3.22c0-.568.176-.992.432-1.266.25-.27.632-.454 1.168-.454h4.145c.54 0 .92.185 1.17.453.255.274.43.698.43 1.267v3.905c0 .569-.175.993-.43 1.267-.25.268-.631.453-1.17.453H7.898c-.54 0-.92-.185-1.17-.453-.255-.274-.43-.698-.43-1.267z"
                          fill="currentColor"
                          fillRule="evenodd"
                        />
                      </svg>
                    }
                    variant="flat"
                  >
                    Copy Link
                  </Button>
                  <Button
                    className="font-medium text-small text-default-500"
                    endContent={
                      <svg
                        fill="none"
                        height="16"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="16"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M7 17 17 7M7 7h10v10" />
                      </svg>
                    }
                    size="sm"
                    variant="flat"
                  >
                    Visit Page
                  </Button>
                </div>
                {/* <div className="flex gap-1 items-center"> */}
                {/*   <Tooltip content="Previous"> */}
                {/*     <Button */}
                {/*       isIconOnly */}
                {/*       className="text-default-500" */}
                {/*       size="sm" */}
                {/*       variant="flat" */}
                {/*     > */}
                {/*       <svg */}
                {/*         fill="none" */}
                {/*         height="16" */}
                {/*         stroke="currentColor" */}
                {/*         strokeLinecap="round" */}
                {/*         strokeLinejoin="round" */}
                {/*         strokeWidth="2" */}
                {/*         viewBox="0 0 24 24" */}
                {/*         width="16" */}
                {/*         xmlns="http://www.w3.org/2000/svg" */}
                {/*       > */}
                {/*         <path d="m18 15-6-6-6 6" /> */}
                {/*       </svg> */}
                {/*     </Button> */}
                {/*   </Tooltip> */}
                {/*   <Tooltip content="Next"> */}
                {/*     <Button */}
                {/*       isIconOnly */}
                {/*       className="text-default-500" */}
                {/*       size="sm" */}
                {/*       variant="flat" */}
                {/*     > */}
                {/*       <svg */}
                {/*         fill="none" */}
                {/*         height="16" */}
                {/*         stroke="currentColor" */}
                {/*         strokeLinecap="round" */}
                {/*         strokeLinejoin="round" */}
                {/*         strokeWidth="2" */}
                {/*         viewBox="0 0 24 24" */}
                {/*         width="16" */}
                {/*         xmlns="http://www.w3.org/2000/svg" */}
                {/*       > */}
                {/*         <path d="m6 9 6 6 6-6" /> */}
                {/*       </svg> */}
                {/*     </Button> */}
                {/*   </Tooltip> */}
                {/* </div> */}
              </DrawerHeader>
              <DrawerBody className="pt-16">
                <div className="flex w-full justify-center items-center pt-4">
                  <Image
                    isBlurred
                    isZoomed
                    alt="Event image"
                    className="aspect-square w-full hover:scale-110"
                    height={300}
                    src="https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/places/san-francisco.png"
                  />
                </div>
                <div className="flex flex-col gap-2 py-4">
                  {!editing ? (
                    <Button
                      className="text-2xl font-bold leading-7"
                      variant="light"
                      onClick={() => setEditing(true)}
                    >
                      SF Bay Area Meetup in November
                    </Button>
                  ) : (
                    <Input
                      defaultValue="SF Bay Area Meetup in November"
                      size="lg"
                      variant="underlined"
                      onBlur={() => setEditing(false)}
                    />
                  )}

                  <p className="text-sm text-default-500">
                    555 California St, San Francisco, CA 94103
                  </p>
                </div>
              </DrawerBody>
              <DrawerFooter className="flex justify-between gap-1">
                <Button
                  className=" font-medium text-small"
                  color="secondary"
                  startContent={<Heart className="size-4" />}
                  variant="flat"
                >
                  Like
                </Button>
                <div className="flex justify-end items-center gap-2">
                  <Button
                    className=" font-medium text-small"
                    color="danger"
                    startContent={<Trash className="size-4" />}
                    variant="flat"
                  >
                    Delete
                  </Button>
                  <Button
                    className="font-medium text-small"
                    color="primary"
                    startContent={<Save className="text-current size-4" />}
                    variant="flat"
                  >
                    Save
                  </Button>
                </div>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
