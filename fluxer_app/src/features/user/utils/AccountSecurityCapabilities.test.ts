// SPDX-License-Identifier: AGPL-3.0-or-later

import {describe, expect, it} from 'vitest';
import {getAccountSecurityCapabilities, isSsoManagedUser} from './AccountSecurityCapabilities';

const userWithTraits = (traits: ReadonlyArray<string>) => ({traits});

describe('account security capabilities', () => {
	it('treats users with the sso trait as SSO-managed', () => {
		expect(isSsoManagedUser(userWithTraits(['sso']))).toBe(true);
		expect(isSsoManagedUser(userWithTraits(['sso:provider']))).toBe(false);
	});

	it('disables local sign-in and MFA management for SSO-managed users', () => {
		expect(getAccountSecurityCapabilities(userWithTraits(['sso']))).toEqual({
			canManageLocalEmail: false,
			canManageLocalPassword: false,
			canManageLocalTotp: false,
			canManageLocalPasskeys: false,
		});
	});

	it('keeps local sign-in and MFA management available for non-SSO users', () => {
		expect(getAccountSecurityCapabilities(userWithTraits([]))).toEqual({
			canManageLocalEmail: true,
			canManageLocalPassword: true,
			canManageLocalTotp: true,
			canManageLocalPasskeys: true,
		});
	});
});
