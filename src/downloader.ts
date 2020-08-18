export class Downloader {
	/** Downloads text from the url. */
	async getText(url: string): Promise<string> {
		const response = await this._get(url);
		return response.text();
	}

	/** Downloads json from the url. */
	async getJson<T extends Record<string, any>>(url: string): Promise<T> {
		const response = await this._get(url);
		return response.json() as Promise<T>;
	}

	/** Downloads binary data from the url. */
	async getBinary(url: string): Promise<ArrayBuffer> {
		return this._get(url).then((response) => {
			return response.arrayBuffer();
		});
	}

	/** Downloads data from the url and returns the response if successful. */
	private async _get(url: string): Promise<Response> {
		if (this._downloads.has(url)) {
			return this._downloads.get(url);
		}
		else {
			const promise = fetch(url).then((response: Response) => {
				this._downloads.delete(url);
				if (Math.floor(response.status / 100) === 2) { // Any 2xx response
					return response;
				}
				else {
					throw new Error('Download failed: ' + response.status + ' ' + response.statusText);
				}
			});
			this._downloads.set(url, promise);
			return promise;
		}
	}

	// The set of active downloads.
	private _downloads: Map<string, Promise<any>> = new Map();
}
