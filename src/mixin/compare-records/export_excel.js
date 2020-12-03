
import { is_string } from 'common/util';
const getDownload = function(url, beginCb, endCb) {
    beginCb();
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true); // 也可用POST方式
    xhr.responseType = 'blob';
    xhr.onload = function() {
        if (this.status === 200) {
            var blob = this.response;
            if (navigator.msSaveBlob == null) {
                var a = document.createElement('a');
                var headerName = xhr.getResponseHeader('Content-disposition');
                var fileName = decodeURIComponent(headerName).substring(20);
                a.download = fileName;
                a.href = URL.createObjectURL(blob);
                $('body').append(a); // 修复firefox中无法触发click
                a.click();
                URL.revokeObjectURL(a.href);
                $(a).remove();
            } else {
                navigator.msSaveBlob(blob, fileName);
            }
        }
        endCb();
    };
    xhr.send();
};
export default {
    methods: {
        create_wb(plugin, filepath, header_types) {
            if (this.plugin_type == 'ie') {
                let plugin_handle;
                if (!plugin) {
                    msg('plugin error!!');
                    return -1;
                }

                plugin_handle = plugin.XLSXCreateFile({
                    filepath,
                    sheet_name: this.lang.i18n_FaceComparison,
                });

                plugin.XLSXSetColumnItemsType({
                    handle: plugin_handle,
                    header_types,
                });
                return plugin_handle;
            } else {
                let workbook = new ExcelJS.Workbook();

                //add sheet
                let sheet = workbook.addWorksheet(this.lang.i18n_FaceComparison);
                sheet.views = [{}];
                sheet.properties.defaultRowHeight = 80;

                sheet.columns = header_types.map((item, idx) => {
                    return {
                        header: item.name,
                        key: 'A' + (idx + 1),
                        width: 20,
                    };
                });

                return {
                    wb: workbook,
                    sht: sheet,
                };
            }
        },
        addrows(plugin, rd) {
            if (this.plugin_type == 'ie') {
                //rd.data中图片base64数据包含'data:image/jpeg;base64,'
                //插件接口需要剔除
                rd.data.forEach((item, j) => {
                    item.forEach((el, idx) => {
                        let tk = 'data:image/jpeg;base64,';
                        if (is_string(el) && el.startsWith(tk)) {
                            item[idx] = el.slice(tk.length);
                        }
                    });
                });
                plugin.XLSXWriteRowDataList(rd);
            } else {
                let sheet = rd.handle.sht;
                let workbook = rd.handle.wb;
                let offset = this.Offset;
                msg('offset', this.Offset);
                rd.data.forEach((item, j) => {
                    item.forEach((el, idx) => {
                        if (is_string(el) && el.startsWith('data:image/jpeg;base64,')) {
                            const img = workbook.addImage({
                                base64: el,
                                extension: 'jpeg',
                            });
                            item[idx] = '';
                            sheet.addImage(img, {
                                tl: { col: idx, row: offset + j + 1 },
                                ext: { width: 60, height: 80 },
                                editAs: 'oneCell',
                            });
                        }else if(is_string(el) && el.startsWith('http')){
                            msg("333333333");
                            msg("el = ", el);
                            const img1 = workbook.addImage({
                                filename: el,
                                extension: 'jpeg',
                            });
                            item[idx] = '';
                            sheet.addImage(img1, {
                                tl: { col: idx, row: offset + j + 1 },
                                ext: { width: 60, height: 80 },
                            });
                            //worksheet1 = workbook.add_worksheet()
                            //worksheet1 = rd.addWorksheet();
                            //sheet.insert_image({ col: idx, row: offset + j + 1 }, 'img/python-logo.png', {'url': el})
                            
                        }
                    });
                    sheet.addRow(item);
                });
            }
        },
        save_wb(plugin, filepath, handle) {
            if (this.plugin_type == 'ie') {
                plugin.XLSXSave({ handle });
            } else {
                let wb = handle.wb;
                wb.xlsx.writeBuffer().then((buffer) => {
                    let a = document.createElement('a');
                    let blob = new Blob([buffer], { type: 'application/vnd.ms-excel' });
                    let objectUrl = URL.createObjectURL(blob);
                    a.setAttribute('href', objectUrl);
                    a.setAttribute('download', filepath);
                    a.click();
                });
            }
        },
    },
};
