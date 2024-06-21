export const updateAmazonUrl = (itemName, tags) => {
    const amazonBaseUrl = 'https://www.amazon.in/s';
    const params = new URLSearchParams({
      k: `${itemName} ${tags.join(' ')}`, 
      adgrpid: '60615884122',
      ext_vrnc: 'hi',
      hvadid: '618279464807',
      hvdev: 'c',
      hvlocphy: '9061770',
      hvnetw: 'g',
      hvqmt: 'b',
      hvrand: '760826671649918641',
      hvtargid: 'kwd-314068596163',
      hydadcr: '23897_2322769',
      tag: 'googinhydr1-21',
      ref: 'pd_sl_5ib7gsbysg_b',
    });
  
    return `${amazonBaseUrl}?${params.toString()}`;
  };
  