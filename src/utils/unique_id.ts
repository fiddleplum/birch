export class UniqueId {
	/** Get a unique id for the account. Source from https://stackoverflow.com/a/2117523/510380. */
	static get(): string {
		return '10000000-1000-4000-80000000-100000000000'.replace(/[018]/g, (c: any) => {
			return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
		});
	}
}
