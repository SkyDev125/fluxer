// SPDX-License-Identifier: AGPL-3.0-or-later

import type {InstanceSso} from '@fluxer/instance_bootstrap/src/Types';
import {describe, expect, it} from 'vitest';
import {isLocalLoginBypassRequested, shouldAutoStartSso} from './AutoSsoRedirect';

const ssoConfig = (overrides: Partial<InstanceSso> = {}): InstanceSso => ({
	enabled: true,
	enforced: false,
	auto_redirect: true,
	display_name: 'Example IDP',
	redirect_uri: 'https://app.example/sso/callback',
	...overrides,
});

describe('auto SSO redirect', () => {
	it('starts automatically when SSO is enabled and auto redirect is configured', () => {
		expect(
			shouldAutoStartSso({
				sso: ssoConfig(),
				localLoginBypassRequested: false,
				desktopHandoff: false,
				isStartingSso: false,
				hasAttemptedAutoSso: false,
			}),
		).toBe(true);
	});

	it('does not start when local login bypass is requested', () => {
		expect(isLocalLoginBypassRequested('/login?local=1')).toBe(true);
		expect(
			shouldAutoStartSso({
				sso: ssoConfig(),
				localLoginBypassRequested: true,
				desktopHandoff: false,
				isStartingSso: false,
				hasAttemptedAutoSso: false,
			}),
		).toBe(false);
	});

	it('does not start when SSO is unavailable or the automatic attempt already happened', () => {
		expect(
			shouldAutoStartSso({
				sso: ssoConfig({enabled: false}),
				localLoginBypassRequested: false,
				desktopHandoff: false,
				isStartingSso: false,
				hasAttemptedAutoSso: false,
			}),
		).toBe(false);
		expect(
			shouldAutoStartSso({
				sso: ssoConfig({auto_redirect: false}),
				localLoginBypassRequested: false,
				desktopHandoff: false,
				isStartingSso: false,
				hasAttemptedAutoSso: false,
			}),
		).toBe(false);
		expect(
			shouldAutoStartSso({
				sso: ssoConfig(),
				localLoginBypassRequested: false,
				desktopHandoff: false,
				isStartingSso: false,
				hasAttemptedAutoSso: true,
			}),
		).toBe(false);
	});

	it('does not interfere with desktop handoff or an in-flight SSO start', () => {
		expect(
			shouldAutoStartSso({
				sso: ssoConfig(),
				localLoginBypassRequested: false,
				desktopHandoff: true,
				isStartingSso: false,
				hasAttemptedAutoSso: false,
			}),
		).toBe(false);
		expect(
			shouldAutoStartSso({
				sso: ssoConfig(),
				localLoginBypassRequested: false,
				desktopHandoff: false,
				isStartingSso: true,
				hasAttemptedAutoSso: false,
			}),
		).toBe(false);
	});
});