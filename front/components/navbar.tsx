'use client';

import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from '@headlessui/react';
import React, { useState } from 'react';
import { FaBars, FaUserCircle } from 'react-icons/fa';
import { ProfileModal } from './profile/profileModal';
import { ProfileContent } from './profile/profileContent';
export default function Navbar(): React.ReactElement {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => {
    setIsModalOpen(true);
    setIsOpen(false);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleLogout = () => {
    // dispatch(logout());
    // navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center"></div>

          {/* Menu and icones */}
          <div className="relative flex items-center space-x-2 rounded-full bg-gray-200 p-2">
            <Menu as="div" className="relative z-50">
              <MenuButton
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center focus:outline-none"
              >
                <FaBars className="h-6 w-6 text-center text-gray-600" />
              </MenuButton>
              <Transition
                show={isOpen}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <MenuItems
                  static
                  className="absolute right-0 top-full mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-md border border-gray-200 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <MenuItem>
                    <button
                      onClick={openModal}
                      className="group flex w-full items-center p-2 text-sm text-gray-900"
                    >
                      Profile
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <a
                      href="/settings"
                      className="group flex w-full items-center p-2 text-sm text-gray-900"
                    >
                      Settings
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <button
                      onClick={handleLogout}
                      className="group flex w-full items-center p-2 text-sm text-gray-900"
                    >
                      Logout
                    </button>
                  </MenuItem>
                </MenuItems>
              </Transition>
            </Menu>
            <button className="focus:outline-none">
              <FaUserCircle className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
      <ProfileModal isOpen={isModalOpen} closeModal={closeModal}>
        <ProfileContent />
      </ProfileModal>
    </header>
  );
}
