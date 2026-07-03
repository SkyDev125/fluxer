// SPDX-License-Identifier: AGPL-3.0-or-later

import type {InstanceSso} from '@fluxer/instance_bootstrap/src/Types';

interface AutoSsoStartOptions {
	sso: InstanceSso | null | undefined;
	localLoginBypassRequested: boolean;
	desktopHandoff: boolean;
	isStartingSso: boolean;
	hasAttemptedAutoSso: boolean;
}

export function isLocalLoginBypassRequested(pathAndSearch: string): boolean {
	const queryStart = pathAndSearch.indexOf('?');
	const search = queryStart >= 0 ? pathAndSearch.slice(queryStart + 1) : pathAndSearch;
	return new URLSearchParams(search).get('local') === '1';
}

export function shouldAutoStartSso({
	sso,
	localLoginBypassRequested,
	desktopHandoff,
	isStartingSso,
	hasAttemptedAutoSso,
}: AutoSsoStartOptions): boolean {
	return Boolean(
		sso?.enabled &&
			sso.auto_redirect &&
			!localLoginBypassRequested &&
			!desktopHandoff &&
			!isStartingSso &&
			!hasAttemptedAutoSso,
	);
}