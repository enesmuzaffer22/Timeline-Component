import React from 'react';

const ButtonInfoTable = ({ buttonInfo }) => {
  if (!buttonInfo) {
    return <div className="button-info">Buton seçilmedi.</div>;
  }

  return (
    <div className="button-info">
      <table>
        <thead>
          <tr>
            <th>Buton Adı</th>
            <th>Saniye Değeri</th>
            <th>Başlangıç</th>
            <th>Bitiş</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{buttonInfo.name}</td>
            <td>{buttonInfo.duration}</td>
            <td>{buttonInfo.start}s</td>
            <td>{buttonInfo.end}s</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ButtonInfoTable;
