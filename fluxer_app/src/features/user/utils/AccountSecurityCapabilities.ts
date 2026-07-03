// SPDX-License-Identifier: AGPL-3.0-or-later

interface TraitBearingUser {
	traits: ReadonlyArray<string>;
}

export interface AccountSecurityCapabilities {
	canManageLocalEmail: boolean;
	canManageLocalPassword: boolean;
	canManageLocalTotp: boolean;
	canManageLocalPasskeys: boolean;
}

export function isSsoManagedUser(user: TraitBearingUser): boolean {
	return user.traits.includes('sso');
}

export function getAccountSecurityCapabilities(user: TraitBearingUser): AccountSecurityCapabilities {
	const canManageLocalAuth = !isSsoManagedUser(user);
	return {
		canManageLocalEmail: canManageLocalAuth,
		canManageLocalPassword: canManageLocalAuth,
		canManageLocalTotp: canManageLocalAuth,
		canManageLocalPasskeys: canManageLocalAuth,
	};
}
