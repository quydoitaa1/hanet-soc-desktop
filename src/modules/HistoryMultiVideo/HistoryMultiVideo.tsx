import React, { useState } from 'react';
import {
    Row,
    Col,
    Input,
    Space,
    Button,
    DatePicker,
    TabsProps,
    Tabs,
    TimePicker,
    Select,
    SelectProps
} from 'antd';

import { Cam } from '@/types/cam.type';

import { SearchOutlined } from '@ant-design/icons';
import Grid from '@/components/Grid';
import ManualCamConfigModal from '../Scheme/components/ManualCamConfigModal';
import CamItem from '../Box/components/CamItem';
import VideoPlayer from './components/VideoPlayer';
import { VideoState } from './components/VideoPlayer/VideoPlayer';

const timeRangeOptions: SelectProps['options'] = Array.from({ length: 24 }, (_, i) => {
    const hour = i;
    return {
        label: `${hour}:00-${hour + 1}:00`,
        value: hour.toString()
    };
});

function getColums(lenght: number): number {
    if (lenght <= 4) {
        return 2;
    }

    if (lenght <= 9) {
        return 3;
    }

    return 4;
}

export const HistoryMultiVideo: React.FC = () => {
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [listSelectedCam, setListSelectedCam] = useState<Cam[]>([]);

    const [listCamShow, setListCamShow] = useState<Cam[]>([
        {
            deviceID: 'C21283M336',
            deviceName: 'C21283M336',
            placeName: 'HNI15001.1148 Đường Láng',
            // address: 'HNI15001.1148 Đường Láng',
            placeID: 12135,
            type: 0
        },
        {
            deviceID: 'C21281M576',
            deviceName: 'C21281M576',
            placeName: 'HNI19042.597 Nguyễn Trãi',
            // address: 'HNI19042.597 Nguyễn Trãi',
            placeID: 10227,
            type: 0
        },
        {
            deviceID: 'C21201B755',
            deviceName: 'HN_597 Nguyễn Trãi Quầy',
            placeName: 'HNI19042.597 Nguyễn Trãi',
            // address: 'HNI19042.597 Nguyễn Trãi',
            placeID: 10227,
            type: 0
        }
    ]);

    const [videoState, setVideoState] = useState<VideoState>({
        paused: true,
        currentTime: 0
    });

    const changeState = (state, prevState) => {
        // copy player state to this component's state
        console.log(state);
        setVideoState((pre) => ({ ...pre, currentTime: state.currentTime }));
    };

    const finishSelectedCam = () => {
        setIsOpenModal(false);
    };
    const startSelectedCam = () => {
        setIsOpenModal(true);
    };

    const handleSubmitSeletedCam = (values) => {
        setListSelectedCam(values);
        finishSelectedCam();
    };

    const handleApplySetting = () => {
        setListCamShow(listSelectedCam);
    };

    console.log('videoState', videoState);

    return (
        <Row className="hanet-history-video" justify="center">
            <Col span={20}>
                <Space style={{ display: 'flex' }} direction="vertical" size={12}>
                    <Row gutter={[8, 8]}>
                        <Col flex="auto">
                            {/* <Search
                            onFocus={handleFocus}
                            placeholder="Tìm kiếm"
                            // onSearch={onSearch}
                        /> */}
                            <Button style={{ width: '100%' }} onClick={startSelectedCam}>
                                <Row justify="space-between">
                                    <Col>
                                        {listSelectedCam.length > 0
                                            ? `${listSelectedCam.length} camera`
                                            : 'Chọn camera'}
                                    </Col>
                                    <Col>
                                        <SearchOutlined />
                                    </Col>
                                </Row>
                            </Button>
                        </Col>

                        <Col flex="200px">
                            <DatePicker
                                //  onChange={onChange}
                                style={{ width: '100%' }}
                            />
                        </Col>
                        <Col flex="200px">
                            <Select
                                style={{ width: '100%' }}
                                placeholder="Chọn thời điểm"
                                options={timeRangeOptions}
                            />
                        </Col>
                        <Col>
                            <Button type="primary" onClick={handleApplySetting}>
                                Áp dụng
                            </Button>
                        </Col>
                    </Row>
                    <div className="body">
                        <Grid columns={getColums(listCamShow.length)}>
                            {listCamShow.map((cam, index) => {
                                return (
                                    <div key={cam.deviceID} className="video-item">
                                        {/* <video autoPlay controls className="video-item-player">
                                            <track kind="captions" />
                                            <source
                                                src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                                                type="video/mp4"
                                            />
                                        </video> */}
                                        <VideoPlayer
                                            src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                                            state={videoState}
                                            changeState={changeState}
                                            head={index === 0}
                                        />
                                        {/* <Player auto autoPlay {...videoState}>
                                            <source
                                                src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                                                type="video/mp4"
                                            />
                                        </Player> */}
                                        <CamItem item={cam} />
                                    </div>
                                );
                            })}
                        </Grid>
                        <Button
                            onClick={() => {
                                setVideoState((pre) => ({ ...pre, paused: !pre.paused }));
                            }}
                        >
                            CLick
                        </Button>
                        <Button
                            onClick={() => {
                                setVideoState((pre) => ({ ...pre, currentTime: 10 }));
                            }}
                        >
                            Set current Time 10s
                        </Button>
                        <Button
                            onClick={() => {
                                setVideoState((pre) => ({ ...pre, currentTime: 20 }));
                            }}
                        >
                            Set current Time 20s
                        </Button>
                    </div>
                </Space>
            </Col>
            <ManualCamConfigModal
                onSubmit={handleSubmitSeletedCam}
                handleCancel={finishSelectedCam}
                open={isOpenModal}
                listSelected={listSelectedCam}
            />
        </Row>
    );
};
