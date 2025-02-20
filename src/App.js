import './App.css';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  List,
  useMediaQuery,
  ListItem,
  ListItemText,
  FormControl,
  InputLabel,
  MenuItem,
  Typography,
  CircularProgress,
  LinearProgress,
  Switch,
  Slider,
  TextField,
  Input,
  InputAdornment,
  Autocomplete,
  IconButton,
  FormHelperText,
  AppBar,
  Toolbar,
  BottomNavigation,
  BottomNavigationAction,
  ListItemButton,
  Drawer,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Zoom
} from '@mui/material';

import {
  CircularProgressProps,
} from '@mui/material/CircularProgress';

import CameraAltIcon from '@mui/icons-material/CameraAlt';
import WifiIcon from '@mui/icons-material/Wifi';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FoundationIcon from '@mui/icons-material/Foundation';
import DoneIcon from '@mui/icons-material/Done';
import WifiTetheringIcon from '@mui/icons-material/WifiTethering';

import SignalWifi1BarIcon from '@mui/icons-material/SignalWifi1Bar';
import SignalWifi2BarIcon from '@mui/icons-material/SignalWifi2Bar';
import SignalWifi3BarIcon from '@mui/icons-material/SignalWifi3Bar';
import SignalWifi4BarIcon from '@mui/icons-material/SignalWifi4Bar';
import SignalWifi1BarLockIcon from '@mui/icons-material/SignalWifi1BarLock';
import SignalWifi2BarLockIcon from '@mui/icons-material/SignalWifi2BarLock';
import SignalWifi3BarLockIcon from '@mui/icons-material/SignalWifi3BarLock';
import SignalWifi4BarLockIcon from '@mui/icons-material/SignalWifi4BarLock';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import ListItemIcon from '@mui/material/ListItemIcon';
import Select from '@mui/material/Select';
import { HOST } from './config.js';

function App() {
  const [cameraPreview, setCameraPreview] = useState(false);
  const [data, setData] = useState({
    version: "1.2.10",
    name: "device_name",
    type: "device_type",
    apSsid: "ap_ssid",
    apPassword: "ap_password",
    apChannel: 1,
    staSsid: "sta_ssid",
    staPassword: "sta_password",
    cameraHorizontalMirror: false,
    cameraVerticalFlip: false,
    cameraBrightness: 1.0,
    cameraContrast: 1.0,
    cameraSaturation: 1.0,
    cameraSharpness: 1.0,
    macAddress: "xx:xx:xx:xx:xx:xx",
    macPrefix: "xxxxxx",
    ipAddress: "192.168.4.1"
  });
  const [value, setValue] = useState(0);
  const [mobile, setMobile] = useState(true);
  const videoUrl = `${HOST}:9000/mjpg`
  // let videoUrl = `HTTP://192.168.4.1:9000/mjpg`
  const updateVersion = async () => {
    try {
      const response = await fetch(`${HOST}/settings`);
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    }
  }

  const handeleCameraPreview = (value) => {
    setCameraPreview(value);
  };


  useEffect(() => {
    console.log("useEffect");
    updateVersion();
  }, []);

  useEffect(() => {
    setMobile(window.innerWidth < 600);
    const handleResize = () => {
      setMobile(window.innerWidth < 600);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const BaseSettings = ({ data }) => {
    return (
      <>
        <WifiAPNamelItem name={data.name} />
        <WifiAPTypeItem type={data.type} />
        <InfoItem title="Mac Address" value={data.macAddress} />
        <InfoItem title="IP Address" value={data.ipAddress} />
        <WifiRebootItem />
      </>
    )
  }

  const APSettings = ({ data }) => {
    return (
      <>
        <WifiAPSsidItem apSsid={data.apSsid} macPrefix={data.macPrefix} />
        <WifiAPPasswordItem apPassword={data.apPassword} />
        <WifiAPChannelItem apPhannel={data.apChannel} />
      </>
    )
  }

  const SteWifiSettings = ({ data }) => {
    return (
      <>
        <WifiStaSsidItem staSsid={data.staSsid} staPassword={data.staPassword} />
      </>
    )
  }

  const CameraSettings = ({ data, handeleCameraPreview, cameraPreview }) => {
    return (
      <>
        <CameraPreviewItem onCameraPreviewSwitch={handeleCameraPreview} cameraPreview={cameraPreview} />
        <CameraHorizontalFlipItem horizontal={data.cameraHorizontalMirror} />
        <CameraVerticalFlipItem vertical={data.cameraVerticalFlip} />
        <CameraBrightnessItem brightness={data.cameraBrightness} />
        <CameraContrastItem contrast={data.cameraContrast} />
        <CameraSaturationItem saturation={data.cameraSaturation} />
        <CameraSharpnessItem sharpness={data.cameraSharpness} />
      </>
    )
  }

  const OTASettings = ({ data }) => {
    return (
      <>
        <InfoItem title="Version" subtitle="Firmware version" value={data.version} />
        <UploadFilesItem mobile={mobile} />
      </>
    )
  }

  const settingsMap = {
    0: <BaseSettings data={data} />,
    1: <APSettings data={data} />,
    2: <SteWifiSettings data={data} />,
    3: <CameraSettings data={data} handeleCameraPreview={handeleCameraPreview} cameraPreview={cameraPreview} />,
    4: <OTASettings data={data} mobile={mobile} />
  };

  const menuItems = [
    { label: "Base", icon: <FoundationIcon />, value: 0 },
    { label: "AP", icon: <WifiTetheringIcon />, value: 1 },
    { label: "WIFI", icon: <WifiIcon />, value: 2 },
    { label: "Camera", icon: <CameraAltIcon />, value: 3 },
    { label: "OTA", icon: <UpgradeIcon />, value: 4 }
  ];


  return (
    <>
      <Box sx={{
        width: '100%',
        height: "100vh",
        display: 'flex',
        flexDirection: "column",
        overflow: 'hidden',
      }}>
        <AppBar position="static" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} >
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              ESP32 Camera Settings
            </Typography>
          </Toolbar>
        </AppBar>
        <Box sx={{
          backgroundColor: 'white',
          height: "100%",
          overflow: 'hidden',
          display: 'flex',
          flexGrow: 1,
        }}>
          {
            !mobile &&
            <Drawer
              variant="permanent"
              sx={{
                width: 240,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
              }}>
              <Toolbar />

              <List>
                {menuItems.map(item => (
                  <ListItemButton key={item.value} onClick={() => setValue(item.value)}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                ))}
              </List>
            </Drawer>
          }
          <Box sx={{ width: '100%', height: "100%", display: 'flex', flexDirection: "column", position: "relative" }}>
            {
              <Box sx={{
                maxWidth: "600px",
                position: 'relative',
                margin: 'auto',
                display: cameraPreview && value === 3 ? 'block' : 'none'
              }}>
                <img style={{ width: "100%", height: "100%" }} src={videoUrl} />
              </Box>
            }
            <Box sx={{ overflowX: "auto" }}>
              {settingsMap[value]}
            </Box>
          </Box>
        </Box >
        {
          mobile &&
          <BottomNavigation
            sx={{
              width: "100%",
            }}
            showLabels
            value={value}
            onChange={handleChange}
          >
            <BottomNavigationAction sx={{ minWidth: "66px" }} label="Base" icon={<FoundationIcon />} />
            <BottomNavigationAction sx={{ minWidth: "66px" }} label="AP" icon={<WifiTetheringIcon />} />
            <BottomNavigationAction sx={{ minWidth: "66px" }} label="WIFI" icon={<WifiIcon />} />
            <BottomNavigationAction sx={{ minWidth: "66px" }} label="Camera" icon={<CameraAltIcon />} />
            <BottomNavigationAction sx={{ minWidth: "66px" }} label="OTA" icon={<UpgradeIcon />} />
          </BottomNavigation>
        }
      </Box >
    </>
  );
}





const sendRequest = (method, url, data = null) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, HOST + url, true);
    if (method === 'POST') {
      xhr.setRequestHeader('Accept', 'application/json');
    }
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(xhr.responseText);
        } else {
          reject(new Error(`Request failed with status ${xhr.status}`));
        }
      }
    };
    if (method === 'POST' && data) {
      const formData = new FormData();
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          formData.append(key, data[key]);
        }
      }
      xhr.send(formData);
    } else {
      xhr.send();
    }
  });
};

const SwitchItem = (props) => {
  const [checked, setChecked] = useState(props.checked || false);

  const handleChange = async (event) => {
    setChecked(event.target.checked);
    const sendData = { [props.name]: event.target.checked };
    try {
      const response = await sendRequest('POST', '/set-' + props.name, sendData, true);
      console.log('返回的的数据:', response);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <SettingItem title={props.title} subtitle={props.subtitle}>
      <Switch checked={checked} onChange={handleChange} />
    </SettingItem>
  )

}

const SliderItem = (props) => {
  const [value, setValue] = useState(props.value || 0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleChangeCommitted = async (event, newValue) => {
    setValue(newValue);
    const sendData = { [props.name]: newValue };
    try {
      const response = await sendRequest('POST', '/set-' + props.name, sendData, true);
      console.log('返回的的数据:', response);
    } catch (error) {
      console.error('Error:', error);
    }
  }
  return (
    <SettingItem title={props.title} subtitle={props.subtitle} sx={{ paddongRight: "10px" }}>
      <Box
        sx={{ width: "80%", marginRight: "10px" }}
      >
        <Slider
          onChangeCommitted={handleChangeCommitted}
          onChange={handleChange}
          value={value}
          // valueLabelFormat={(value) => `${value}%`}
          valueLabelDisplay="auto"
          sx={{ marginTop: 2, }}
          min={props.min}
          max={props.max}
        />
      </Box>
    </SettingItem>
  )
}

const SelectableItem = ({ title, subtitle, value, options, onChange, apiEndpoint }) => {
  const [selectedValue, setSelectedValue] = useState(value);
  const [helperText, setHelperText] = useState("");
  const [showDoneIcon, setShowDoneIcon] = useState(false);

  const handleChange = async (event) => {
    const newValue = event.target.value;
    setSelectedValue(newValue);

    const sendData = { [apiEndpoint]: newValue };

    try {
      const response = await sendRequest('POST', '/set-' + apiEndpoint, sendData);
      console.log('Response:', response);

      setHelperText("Setting success");
      setShowDoneIcon(true);
      setTimeout(() => {
        setHelperText("");
        setShowDoneIcon(false);
      }, 3000);
    } catch (error) {
      console.error('Error:', error);
      setHelperText("Error occurred");
    }
  };

  return (
    <SettingItem title={title} subtitle={subtitle}>
      <Box sx={{ width: 200, maxWidth: "70%" }}>
        <FormControl variant="standard" sx={{ width: '100%' }}>
          <InputLabel id={`select-${title}-label`}>{title}</InputLabel>
          <Select
            labelId={`select-${title}-label`}
            id={`select-${title}`}
            value={selectedValue}
            onChange={handleChange}
            label={title}
          >
            {options.map((option, index) => (
              <MenuItem key={index} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
          {showDoneIcon && (
            <FormHelperText>
              <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <DoneIcon sx={{ paddingRight: 1 }} /> {helperText}
              </Box>
            </FormHelperText>
          )}
        </FormControl>
      </Box>
    </SettingItem>
  );
};

const EditableItem = ({ title, subtitle, value, onChange, apiEndpoint, type = "text" }) => {
  const [inputValue, setInputValue] = useState(value);
  const [loading, setLoading] = useState(false);
  const [helperText, setHelperText] = useState("");
  const [showDoneIcon, setShowDoneIcon] = useState(false);

  useEffect(() => {
    setInputValue(value); // 监听 props 的变化
  }, [value]);

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleChangeCommitted = async () => {
    setLoading(true);
    const sendData = { [apiEndpoint]: inputValue };
    try {
      const response = await sendRequest('POST', '/set-' + apiEndpoint, sendData);
      console.log('返回的数据:', response);
      setLoading(false);
      setHelperText("Success, Restart to apply.");
      setShowDoneIcon(true);
      setTimeout(() => {
        setHelperText("");
        setShowDoneIcon(false);
      }, 3000);
    } catch (error) {
      console.error('Error:', error);
      setHelperText(error.message || "Error occurred");
      setLoading(false);
    }
  };

  return (
    <SettingItem title={title} subtitle={subtitle}>
      <Box sx={{ width: 200, maxWidth: "70%" }}>
        <TextField
          label={title}
          type={type}
          variant="standard"
          value={inputValue}
          onChange={handleChange}
          helperText={
            showDoneIcon && (
              <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <DoneIcon sx={{ paddingRight: 1 }} /> {helperText}
              </Box>
            )
          }
          InputProps={{
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : (
                  <IconButton color="primary" onClick={handleChangeCommitted}>
                    <DoneIcon />
                  </IconButton>
                )}
              </>
            ),
          }}
        />
      </Box>
    </SettingItem>
  );
};

const InfoItem = ({ title, subtitle, value }) => {
  return (
    <SettingItem title={title} subtitle={subtitle}>
      <Typography variant="h8" gutterBottom >
        {value || "Not Available"}
      </Typography>
    </SettingItem>
  );
};

// 画面预览
const CameraPreviewItem = (props) => {
  const [checked, setChecked] = useState(props.cameraPreview);
  const handleChange = (event) => {
    setChecked(event.target.checked);
    props.onCameraPreviewSwitch(event.target.checked);
  };
  return (
    <SettingItem title="Preview" subtitle="Preview camera">
      <Switch checked={checked} onChange={handleChange} />
    </SettingItem>
  );
}

// 画面水平翻转
const CameraHorizontalFlipItem = (props) => {
  return (
    <SwitchItem
      title="Horizontal flip"
      subtitle="Set horizontal flip"
      name="cameraHorizontalMirror"
      checked={props.horizontal}
    />
  )
}

// 画面垂直翻转
const CameraVerticalFlipItem = (props) => {
  return (
    <SwitchItem
      title="Vertical flip"
      subtitle="Set vertical flip"
      name="cameraVerticalFlip"
      checked={props.vertical}
    />
  );
}

// 画面亮度设置
const CameraBrightnessItem = (props) => {
  return (
    <SliderItem
      title="Brightness"
      subtitle="Set brightness"
      name="cameraBrightness"
      value={props.brightness}
      min={-3}
      max={3}
    />
  )
}

// 画面对比度设置
const CameraContrastItem = (props) => {
  return (
    <SliderItem
      title="Contrast"
      subtitle="Set contrast"
      name="cameraContrast"
      value={props.contrast}
      min={-3}
      max={3}
    />
  )
}

// 画面饱和度设置
const CameraSaturationItem = (props) => {
  return (
    <SliderItem
      title="Saturation"
      subtitle="Set saturation"
      name="cameraSaturation"
      value={props.saturation}
      min={-3}
      max={3}
    />
  )
}

// 画面清晰度设置
const CameraSharpnessItem = (props) => {
  return (
    <SliderItem
      title="Sharpness"
      subtitle="Set sharpness"
      name="cameraSharpness"
      value={props.sharpness}
      min={-3}
      max={3}
    />
  )
}

// AP 频道设置
const WifiAPChannelItem = (props) => {
  return (
    <SelectableItem
      title="AP Channel"
      subtitle="Set AP channel"
      value={props.apPhannel}
      options={[...Array(11)].map((_, index) => index + 1)}
      onChange={props.onChannelChange}
      apiEndpoint="apChannel"
    />
  );
}

// AP 名称设置
const WifiAPNamelItem = (props) => {
  return (
    <EditableItem
      title="Name"
      subtitle="Set Name"
      value={props.name}
      onChange={props.onNameChange}
      apiEndpoint="name"
    />
  );
}

// AP type 设置
const WifiAPTypeItem = (props) => {
  return (
    <SelectableItem
      title="Type"
      subtitle="Set Type"
      value={props.type}
      options={["GalaxyRVR", "ZeusCar"]}
      onChange={props.onTypeChange}
      apiEndpoint="type"
    />
  )
}

// 重启设备
const WifiRebootItem = (props) => {
  const [dialogShow, setDialogShow] = useState(false);
  const handleRebootDevice = async () => {
    setDialogShow(true);
  }
  const handleConfirm = async () => {
    try {
      const response = await sendRequest('POST', '/restart');
      console.log('返回的的数据:', response);
      setDialogShow(false);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const handleClose = () => {
    setDialogShow(false);
  }

  return (
    <>
      <SettingItem title="Reboot" subtitle="Reboot Device">
        <Box sx={{ width: 200, maxWidth: "70%", display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" color="error" onClick={handleRebootDevice}>Reboot</Button>
        </Box>
      </SettingItem>
      <DialogBox
        onConfirm={handleConfirm}
        onClose={handleClose}
        open={dialogShow}
        title="Reboot"
        content="Are you sure you want to reboot the device?" />
    </>
  )
}

// AP 名称设置 
const WifiAPSsidItem = (props) => {
  const [apSsid, setApSsid] = useState(props.apSsid || "");
  const handleChange = (event) => {
    setApSsid(event.target.value);
  }
  return (
    <SettingItem title="AP SSID" subtitle="Set AP SSID">
      <Box sx={{ width: 200, maxWidth: "70%" }}>
        <FormControl variant="standard">
          <InputLabel htmlFor="standard-adornment-macPrefix">SSID</InputLabel>
          <Input
            disabled
            id="standard-adornment-macPrefix"
            endAdornment={<InputAdornment position="end">{`- ${props.macPrefix}`}</InputAdornment>}
            aria-describedby="standard-macPrefix-helper-text"
            value={apSsid}
            onChange={handleChange}
          />
        </FormControl>
      </Box>
    </SettingItem>
  )
}

// AP  密码设置 
const WifiAPPasswordItem = (props) => {
  return (
    <EditableItem
      title="AP Password"
      subtitle="Set AP Password"
      value={props.apPassword || ""}
      onChange={props.onPasswordChange}
      apiEndpoint="apPassword"
      type="password"
    />
  );
}

// sta 名称设置
const WifiStaSsidItem = (props) => {
  const [staSsid, setStaSsid] = useState(props.staSsid || "");
  const [staPassword, setStaPassword] = useState(props.staPassword || "");
  const [helperText, setHelperText] = useState("");
  const [showDoneIcon, setShowDoneIcon] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSsidChange = (value) => {
    setStaSsid(value);
  }

  const handlePasswordChange = (event) => {
    setStaPassword(event.target.value);
  }

  const handleSSIDListInputChange = (ssid) => {
    setStaSsid(ssid);
  }

  const handleChangeCommitted = async () => {
    const sendData = { ssid: staSsid, password: staPassword };
    setLoading(true);
    try {
      const response = await sendRequest('POST', '/set-sta', sendData);
      console.log('返回的的数据:', response);
      setShowDoneIcon(true);
      setHelperText("Success,Restart to apply.");
      setTimeout(() => {
        setHelperText("");
        setShowDoneIcon(false);
        setLoading(false);
      }, 3000)
    } catch (error) {
      console.error('Error:', error);
      setHelperText(error);
      setLoading(false);
    }
  }

  return (
    <>
      <SettingItemSSIDList
        title="STA SSID"
        subtitle="Set Sta SSID"
        request={handleChangeCommitted}
        onChange={handleSsidChange}
        onIinputChange={handleSSIDListInputChange}
      />
      <SettingItem title="STA password" subtitle="Set Sta password" >
        <Box sx={{ width: 200, maxWidth: "50%", }}>
          <TextField
            id="standard-password-input"
            label="Password"
            type="password"
            autoComplete="current-password"
            variant="standard"
            defaultValue={staPassword}
            onChange={handlePasswordChange}
            helperText={
              <>
                {
                  showDoneIcon &&
                  <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                    <DoneIcon sx={{ paddingRight: 1 }} /> {helperText}
                  </Box>
                }
              </>
            }
          />
        </Box>
      </SettingItem>
      <Zoom in disabled={loading ? true : false}>
        <Fab variant="extended" color="primary" sx={{ position: "absolute", right: 16, bottom: 16 }} onClick={handleChangeCommitted}>
          {
            loading ? <CircularProgress color="inherit" size={20} sx={{ mr: 1 }} /> : <DoneIcon sx={{ mr: 1 }} />
          }
          Confirm
        </Fab>
      </Zoom>
    </>
  )
}

const SettingItemSSIDList = (props) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [ssidList, setSsidList] = useState([]);
  const [timerId, setTimerId] = useState(null);
  const [loading, setLoading] = useState(false);

  const getWiFiStrengthIcon = (rssi, secure) => {
    if (rssi >= -60) {
      if (secure) return <SignalWifi4BarLockIcon />;
      else return <SignalWifi4BarIcon />;
    } else if (rssi >= -80) {
      if (secure) return <SignalWifi3BarLockIcon />;
      else return <SignalWifi3BarIcon />;
    } else if (rssi >= -90) {
      if (secure) return <SignalWifi2BarLockIcon />;
      else return <SignalWifi2BarIcon />;
    } else {
      if (secure) return <SignalWifi1BarLockIcon />;
      else return <SignalWifi1BarIcon />;
    }
  }
  let ssidLists = [];
  const startWiFiScan = async (rssid) => {
    try {
      setLoading(true);
      const response = await sendRequest('GET', '/scan-wifi');
      setTimerId(setTimeout(getSsidList, 1000));
      console.log('返回的的数据:', response);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const getSsidList = async () => {
    try {
      setLoading(true);
      let response = await sendRequest("GET", '/scan-wifi');
      if (typeof response === "string") {
        try {
          ssidLists = JSON.parse(response);
        } catch (e) {
          console.error("JSON 解析失败:", e);
          ssidLists = null;
        }
      } else {
        ssidLists = response;
      }

      console.log("返回的数据:", ssidLists);
    } catch (error) {
      console.error("Error:", error);
    }

    // 确保 ssidList 是数组
    if (Array.isArray(ssidLists)) {
      setSsidList(ssidLists);
      setOptions(ssidLists.map((ssid) => ssid.ssid));
      setLoading(false);
      stopGetSsidList();
    } else if (ssidLists === -2) {
      setLoading(false);
      stopGetSsidList();
    } else {
      setTimerId(setTimeout(getSsidList, 1000));
    }
  };


  const stopGetSsidList = () => {
    setLoading(false);
    setTimerId(clearTimeout(timerId));
  }

  return (
    <SettingItem {...props}>
      <Box sx={{ width: 200, maxWidth: "50%" }}>
        <Autocomplete
          id={props.id}
          open={open}
          value={props.value}
          disabled={props.disabled}
          onOpen={() => {
            setOpen(true);
            startWiFiScan();
          }}
          onClose={() => {
            setOpen(false);
            stopGetSsidList();
          }}
          onChange={(event, newValue) => {
            props.onChange(newValue);
          }}
          onInputChange={(event, newInputValue) => {
            props.onIinputChange(newInputValue);
          }}
          options={options}
          loading={loading}
          freeSolo
          renderOption={(props, ssid) => {
            let ssidData = ssidList.find((item) => item.ssid === ssid);
            return (<Box component="li" sx={{ display: "flex", alignItems: 'space-between', '& > img': { flexShrink: 0 } }} {...props}>
              {getWiFiStrengthIcon(ssidData.rssi, ssidData.secure)}
              <Typography sx={{ flexGrow: 1, padding: "0 8px" }}>{ssidData.ssid}</Typography>
            </Box>)
          }}
          renderInput={(params) => (
            <TextField
              variant="standard"
              {...params}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
          )}
        />
      </Box>
    </SettingItem>
  );
}

const UploadFilesItem = (props) => {
  const [selectedFileName, setSelectedFileName] = useState('Upload files');
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [progress, setProgress] = useState(0);
  const [progressShow, setProgressShow] = useState(false);
  const [dialogShow, setDialogShow] = useState(false);

  const handleSelectFile = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      const file = files[0];
      // 检查文件类型是否为 .bin
      if (file.name.endsWith('.bin')) {
        setSelectedFiles(file);
        setSelectedFileName(file.name);
      } else {
        alert('Please select a .bin file only.');
        event.target.value = ''; // 清空文件选择
        setSelectedFileName('Upload files');
      }
    }
  };
  const handleUpload = (event) => {
    if (selectedFiles) {
      setProgressShow(true);
      let formData = new FormData();
      formData.append('update', selectedFiles);
      let xhr = new XMLHttpRequest();
      xhr.open('POST', `${HOST}/update`);
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          let progress = e.loaded / e.total * 100;
          setProgress(progress);
          if (progress === 100 && xhr.status === 200) {
            setProgressShow(false);
            setSelectedFileName('Upload files');
            setDialogShow(true);
          }
        }
      });
      xhr.send(formData);
    }
  };
  const handleConfirm = async () => {
    try {
      const response = await sendRequest('POST', '/restart');
      console.log('返回的的数据:', response);
      setDialogShow(false);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const handleClose = () => {
    setDialogShow(false);
  }

  // 文件上传按钮组件
  const FileUploadButton = ({ selectedFileName, handleSelectFile }) => (
    <ListItemButton
      component="label"
      variant="contained"
      startIcon={<CloudUploadIcon />}
      color='inherit'
    >
      <ListItemText primary="Choose File" secondary={selectedFileName} />
      {/* {selectedFileName} */}
      <input
        type="file"
        accept=".bin"
        onChange={handleSelectFile}
        style={{ display: 'none' }}
        multiple
      />
      <ChevronRightIcon />
    </ListItemButton>
  );

  // useEffect(() => {
  //   if (progressShow) {
  //     const timer = setInterval(() => {
  //       setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
  //     }, 800);
  //     return () => {
  //       if (progress >= 100) {
  //         setProgressShow(false);
  //         setDialogShow(true);
  //       }
  //       clearInterval(timer);
  //     }
  //   }
  // })

  return (
    <>
      <FileUploadButton selectedFileName={selectedFileName} handleSelectFile={handleSelectFile} />
      <Zoom in>
        <Fab
          variant={
            progressShow ? "circular" : "extended"
          }
          color="primary"
          disabled={progressShow ? true : false}
          sx={{ position: "absolute", right: 16, bottom: 16 }}
          onClick={handleUpload}
        >
          {
            progressShow ?
              <CircularProgressWithLabel value={progress} size={64}></CircularProgressWithLabel> :
              <><UpgradeIcon sx={{ mr: 1 }} />{selectedFiles ? "Update" : "Please select file"}</>
          }
        </Fab>
      </Zoom>
      <DialogBox
        onConfirm={handleConfirm}
        onClose={handleClose}
        open={dialogShow}
        title="Upload"
        content="File uploaded successfully, Are you sure you want to reboot the device?" />
    </>
  )
}

const SettingItem = (props) => {
  const isSmallScreen = useMediaQuery('(max-width: 768px)');
  let flexDirection = 'row';

  if (props.wrap && isSmallScreen) flexDirection = 'column';

  return (<>
    <ListItem sx={{ flexDirection: flexDirection }}>
      <ListItemText primary={props.title} secondary={props.subtitle} sx={{ width: '100%' }} />
      <Box sx={{ display: 'flex', flexFlow: 'right', justifyContent: 'flex-end', width: '100%' }}>
        {props.children}
      </Box>
    </ListItem>
  </>
  )
}

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number },
) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="caption"
          component="div"
          sx={{ color: 'text.secondary' }}
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

// 弹窗组件
const DialogBox = (props) => {
  return (
    <>
      <Dialog
        open={props.open}
        onClose={props.onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {props.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onConfirm}>Confirm</Button>
          <Button onClick={props.onClose} autoFocus>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default App;
